/*
*	env.rhino.js
*/
(function($env){
    
    $env.log = function(msg, level){
         print(' '+ (level?level:'LOG') + ':\t['+ new Date()+"] {ENVJS} "+msg);
    };
    
    $env.lineSource = function(e){
        return e&&e.rhinoException?e.rhinoException.lineSource():"(line ?)";
    };
    
    $env.hashCode = function(obj){
        return obj?obj.hashCode().toString()+'':null;
    };
    
    //For Java the window.location object is a java.net.URL
    $env.location = function(path, base){
      var protocol = new RegExp('(^file\:|^http\:|^https\:)');
        var m = protocol.exec(path);
        if(m&&m.length>1){
            return new java.net.URL(path).toString()+'';
        }else if(base){
          return new java.net.URL(new java.net.URL(base), path).toString()+'';
        }else{
            //return an absolute url from a url relative to the window location
            if(window.location.href.length > 0){
                base = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
                return base + '/' + path;
            }else{
                return new java.io.File(  path ).toURL().toString()+'';
            }
        }
    };
    
    var timers = [];

    $env.timer = function(fn, interval){
	this.fn = fn;
	this.interval = interval;
	this.at = Date.now() + interval;
	this.index = timers.length;
	timers[this.index] = this;
    };	

    $env.timer.prototype.start = function(){};
    $env.timer.prototype.stop = function(){
	delete timers[this.index];
    };

    // wait === null: execute any immediately runnable timers and return
    // wait(n) (n > 0): execute any timers as they fire but no longer than n ms
    // wait(0): execute any timers as they fire, waiting until there are none left
    $env.wait = function(wait) {
	var i;
	var empty;
	var after;
	var now;
	var timer;
	var sleep;
	if (wait !== 0 && wait !== null && wait !== undefined){
	    wait += Date.now();
	}
	for (;;) {
	    for (i in timers){
		timer = timers[i];
		now = Date.now();
		if (timer.at <= now){
		    f = timer.fn;
		    f();
		    timer.at = Date.now() + timer.interval;
		}
	    }
	    empty = true;
	    sleep = null;
	    now = Date.now();
	    for (i in timers){
		empty  = false;
		timer = timers[i];
		after = timer.at - now
		sleep = (sleep === null || after < sleep) ? after : sleep;
	    }
	    sleep = sleep < 0 ? 0 : sleep;
	    if (empty || ( wait !== 0 ) && ( ( sleep > 0 && !wait ) || ( Date.now() + sleep > wait ) ) ) {
		break;
	    }
	    if (sleep) {
		java.lang.Thread.currentThread().sleep(sleep);
	    }
	}
    };

    //Since we're running in rhino I guess we can safely assume
    //java is 'enabled'.  I'm sure this requires more thought
    //than I've given it here
    $env.javaEnabled = true;	
    
    
    //Used in the XMLHttpRquest implementation to run a
    // request in a seperate thread
    $env.runAsync = function(fn){
        $env.debug("running async");
        (new java.lang.Thread(new java.lang.Runnable({
            run: fn
        }))).start();
    };
    
    //Used to write to a local file
    $env.writeToFile = function(text, url){
        $env.debug("writing text to url : " + url);
        var out = new java.io.FileWriter( 
            new java.io.File( 
                new java.net.URI(url.toString())));	
        out.write( text, 0, text.length );
        out.flush();
        out.close();
    };
    
    //Used to write to a local file
    $env.writeToTempFile = function(text, suffix){
        $env.debug("writing text to temp url : " + suffix);
        // Create temp file.
        var temp = java.io.File.createTempFile("envjs-tmp", suffix);
    
        // Delete temp file when program exits.
        temp.deleteOnExit();
    
        // Write to temp file
        var out = new java.io.FileWriter(temp);
        out.write(text, 0, text.length);
        out.close();
        return temp.getAbsolutePath().toString()+'';
    };
    
    //Used to delete a local file
    $env.deleteFile = function(url){
        var file = new java.io.File( new java.net.URI( url ) );
        file["delete"]();
    };
    
    $env.connection = function(xhr, responseHandler, data){
        var url = java.net.URL(xhr.url);//, $w.location);
      var connection;
        if ( /^file\:/.test(url) ) {
            if ( xhr.method == "PUT" ) {
                var text =  data || "" ;
                $env.writeToFile(text, url);
            } else if ( xhr.method == "DELETE" ) {
                $env.deleteFile(url);
            } else {
                connection = url.openConnection();
                connection.connect();
            }
        } else { 
            connection = url.openConnection();
            connection.setRequestMethod( xhr.method );
			
            // Add headers to Java connection
            for (var header in xhr.headers){
                connection.addRequestProperty(header+'', xhr.headers[header]+'');
            }
			
			//write data to output stream if required
            if(data&&data.length&&data.length>0){
				 if ( xhr.method == "PUT" || xhr.method == "POST" ) {
                	connection.setDoOutput(true);
					var outstream = connection.getOutputStream(),
						outbuffer = new java.lang.String(data).getBytes('UTF-8');
					
                    outstream.write(outbuffer, 0, outbuffer.length);
					outstream.close();
            	}
			}else{
		  		connection.connect();
			}
			
            
            var respheadlength = connection.getHeaderFields().size();
            // Stick the response headers into responseHeaders
            for (var i = 0; i < respheadlength; i++) { 
                var headerName = connection.getHeaderFieldKey(i); 
                var headerValue = connection.getHeaderField(i); 
                if (headerName)
                    xhr.responseHeaders[headerName+''] = headerValue+'';
            }
        }
        if(connection){
                xhr.readyState = 4;
                xhr.status = parseInt(connection.responseCode,10) || undefined;
                xhr.statusText = connection.responseMessage || "";
                
                var contentEncoding = connection.getContentEncoding() || "utf-8",
                    baos = new java.io.ByteArrayOutputStream(),
                    buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024),
                    length,
                    stream = null,
                    responseXML = null;

                try{
                    stream = (contentEncoding.equalsIgnoreCase("gzip") || contentEncoding.equalsIgnoreCase("decompress") )?
                            new java.util.zip.GZIPInputStream(connection.getInputStream()) :
                            connection.getInputStream();
                }catch(e){
                    $env.error('failed to open connection stream \n'+e.toString(), e);
                    stream = connection.getErrorStream();
                }
                
                while ((length = stream.read(buffer)) != -1) {
                    baos.write(buffer, 0, length);
                }

                baos.close();
                stream.close();

                xhr.responseText = java.nio.charset.Charset.forName("UTF-8").
                    decode(java.nio.ByteBuffer.wrap(baos.toByteArray())).toString()+"";
                
        }
        if(responseHandler){
          responseHandler();
        }
    };
    
    var htmlDocBuilder = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    htmlDocBuilder.setNamespaceAware(false);
    htmlDocBuilder.setValidating(false);
    
    $env.parseHTML = function(htmlstring){
        return htmlDocBuilder.newDocumentBuilder().parse(
                  new java.io.ByteArrayInputStream(
                        (new java.lang.String(htmlstring)).getBytes("UTF8")))+"";
    };
    
    var xmlDocBuilder = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();
    xmlDocBuilder.setNamespaceAware(true);
    xmlDocBuilder.setValidating(true);
    
    $env.parseXML = function(xmlstring){
        return xmlDocBuilder.newDocumentBuilder().parse(
                  new java.io.ByteArrayInputStream(
                        (new java.lang.String(xmlstring)).getBytes("UTF8")))+"";
    };
    
    
    $env.xpath = function(expression, doc){
    return Packages.javax.xml.xpath.
      XPathFactory.newInstance().newXPath().
        evaluate(expression, doc, javax.xml.xpath.XPathConstants.NODESET);
    };
    
    $env.tmpdir         = java.lang.System.getProperty("java.io.tmpdir"); 
    $env.os_name        = java.lang.System.getProperty("os.name"); 
    $env.os_arch        = java.lang.System.getProperty("os.arch"); 
    $env.os_version     = java.lang.System.getProperty("os.version"); 
    $env.lang           = java.lang.System.getProperty("user.lang"); 
    $env.platform       = "Rhino ";//how do we get the version
    
    $env.safeScript = function(){
      //do nothing  
    };
    
    $env.scriptTypes = {
        "text/javascript"   :false,
        "text/envjs"        :true
    };
    
    
    $env.loadInlineScript = function(script){
        $env.debug("loading inline script :" + script.text);
        var tmpFile = $env.writeToTempFile(script.text, 'js') ;
        $env.debug("loading " + tmpFile);
        load(tmpFile);
    };
    
})(Envjs);