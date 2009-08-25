
/**
 * @author thatcher
 */
var Envjs = function(){
    if(arguments.length === 2){
        for ( var i in arguments[1] ) {
    		var g = arguments[1].__lookupGetter__(i), 
                s = arguments[1].__lookupSetter__(i);
    		if ( g || s ) {
    			if ( g ) Envjs.__defineGetter__(i, g);
    			if ( s ) Envjs.__defineSetter__(i, s);
    		} else
    			Envjs[i] = arguments[1][i];
    	}
    }
    window.location = arguments[0];
};

/*
*	env.rhino.js
*/
(function($env){
    
    //You can emulate different user agents by overriding these after loading env
    $env.appCodeName  = "Envjs";//eg "Mozilla"
    $env.appName      = "Resig/20070309 BirdDog/0.0.0.1";//eg "Gecko/20070309 Firefox/2.0.0.3"

    //set this to true and see profile/profile.js to select which methods
    //to profile
    $env.profile = false;
    
    $env.log = function(msg, level){};
    $env.debug  = function(){};
    $env.info   = function(){};
    $env.warn   = function(){};
    $env.error  = function(){};
    
    
    $env.debugParser = false;
    //uncomment these if you want to get some internal log statementes
    /*$env.debug  = function(msg){
        $env.log(msg,"DEBUG"); 
    };*/
    $env.info   = function(msg){
        $env.log(msg,"INFO"); 
    };
    $env.warn   = function(msg){
        $env.log(msg,"WARNIING");    
    };
    $env.error = function(msg, e){
        $env.log(msg+ " Line: "+ $env.lineSource(e),'ERROR');
        $env.log(e||"",'ERROR');
    };
    
    $env.info("Initializing Core Platform Env");
    
    $env.lineSource = function(e){};
    
    $env.hashCode = function(obj){};
    
    //resolves location relative to base or window location
    $env.location = function(path, base){};
    
    //For Java the window.timer is created using the java.lang.Thread in combination
    //with the java.lang.Runnable
    $env.timer = function(fn, time){};	
    $env.wait = function(wait){};
    
    $env.javaEnabled = false;	
    
    //Used in the XMLHttpRquest implementation to run a
    // request in a seperate thread
    $env.runAsync = function(fn){};
    
    //Used to write to a local file
    $env.writeToFile = function(text, url){};
    
    //Used to write to a local file
    $env.writeToTempFile = function(text, suffix){};
    
    //Used to delete a local file
    $env.deleteFile = function(url){};
    
    $env.connection = function(xhr, responseHandler, data){};
    
    $env.parseHTML = function(htmlstring){};
    $env.parseXML = function(xmlstring){};
    $env.xpath = function(expression, doc){};
    
    $env.tmpdir         = ''; 
    $env.os_name        = ''; 
    $env.os_arch        = ''; 
    $env.os_version     = ''; 
    $env.lang           = ''; 
    $env.platform       = "Rhino ";//how do we get the version
    
    $env.load = function(){};
    
    $env.safeScript = function(){
      //do nothing  
    };
    
    $env.scriptTypes = {
        "text/javascript"   :false,
        "text/envjs"        :true
    };
    
    $env.onScriptLoadError = function(){};
    $env.loadLocalScript = function(script, parser){
        $env.debug("loading script ");
        var types, type, src, i, base, 
            docWrites = [],
            write = document.write,
            writeln = document.writeln;
        //temporarily replace document write becuase the function
        //has a different meaning during parsing
        document.write = function(text){
			docWrites.push(text);
		};
        try{
			if(script.type){
                types = script.type?script.type.split(";"):[];
                for(i=0;i<types.length;i++){
                    if($env.scriptTypes[types[i]]){
						if(script.src){
                            $env.info("loading allowed external script :" + script.src);
                            //lets you register a function to execute 
                            //before the script is loaded
                            if($env.beforeload){
                                for(src in $env.beforeload){
                                    if(script.src.match(src)){
                                        $env.beforeload[src]();
                                    }
                                }
                            }
                            base = "" + window.location;
							load($env.location(script.src.match(/([^\?#]*)/)[1], base ));
                            //lets you register a function to execute 
                            //after the script is loaded
                            if($env.afterload){
                                for(src in $env.afterload){
                                    if(script.src.match(src)){
                                        $env.afterload[src]();
                                    }
                                }
                            }
                        }else{
                            $env.loadInlineScript(script);
                        }
                    }else{
                        if(!script.src && script.type == "text/javascript"){
                            $env.loadInlineScript(script);
                        }
                    }
                }
            }else{
                //anonymous type and anonymous src means inline
                if(!script.src){
                    $env.loadInlineScript(script);
                }
            }
        }catch(e){
            $env.error("Error loading script.", e);
            $env.onScriptLoadError(script);
        }finally{
            if(parser){
                parser.appendFragment(docWrites.join(''));
			}
			//return document.write to it's non-script loading form
            document.write = write;
            document.writeln = writeln;
        }
    };
    
    $env.loadInlineScript = function(script){};

    $env.forceAsciiXML = false;
    
    
    $env.globalize = function(){};
    $env.getScope = function(){};
    $env.setScope = function(){};
    $env.configureScope = function(){};
    $env.restoreScope = function(){};
    $env.loadFrame = function(frame, url){
        try {

            var frameWindow,
            	makingNewWinFlag = !(frame._content);
            if (makingNewWinFlag)
                // a blank object, inherits from original global
                // see org.mozilla.javascript.tools.envjs.Window.java
                frameWindow = $env.globalize();
            else
                frameWindow = frame._content;


            // define local variables with content of things that are
            // in current global/window, because when the following
            // function executes we'll have a new/blank
            // global/window and won't be able to get at them....
            var local__window__    = $env.window,
            	local_env          = $env,
                local_window       = frame.ownerDocument.parentWindow;

            // a local function gives us something whose scope
            // is easy to change
            var __frame__   = function(){
                if (makingNewWinFlag){
                    local__window__(frameWindow, 
                                    local_env,
                                    local_window,
                                    local_window.top);
                }

                frameWindow.location = url;
            }


            // change scope of window object creation
            //   functions, so that functions/code they create
            //   will be scoped to new window object
            // getScope()/setScope() from Window.java
            var scopes = {
                frame : $env.getScope(__frame__),
                window : $env.getScope(local__window__),
                global_load: $env.getScope(load),
                local_load: $env.getScope($env.loadLocalScript)
            };

            $env.setScope(__frame__,             frameWindow);
            $env.setScope(local__window__,       frameWindow);
            $env.setScope($env.load,             frameWindow);
            $env.setScope($env.loadLocalScript,  frameWindow);

            __frame__();
            frame._content = frameWindow;

            // now restore the scope
            $env.setScope(__frame__, scopes.frame);
            $env.setScope(local__window__, scopes.window);
            $env.setScope($env.load, scopes.global_load);
            $env.setScope($env.loadLocalScript, scopes.local_load);
            
        } catch(e){
            $env.error("failed to load frame content: from " + url, e);
        }

    };
    
})(Envjs);