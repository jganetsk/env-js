//debugger;
load("build/runtest/env.js");

(function($env){
    
    //$env.fixHTML = false;
    
    $env("test/index.html", {
        //let it load the script from the html
        scriptTypes: {
            "text/javascript"   :true
        },
        afterload:{
            'qunit/testrunner.js': function(){
                //hook into qunit.log
                var count = 0;
                QUnit.log = function(result, message){
                    $env.log('(' + (count++) + ')[' + 
                        ((!!result) ? 'PASS' : 'FAIL') + '] ' + message);
                };
                //hook into qunit.done
                QUnit.done = function(pass, fail){
                    $env.warn('Writing Results to File');
                    jQuery('script').each(function(){
                        this.type = 'text/envjs';
                    });
                    $env.writeToFile(
                        document.documentElement.xml, 
                        $env.location('jqenv-'+Date.now()+'.html')
                    );
                };
                
                //allow jquery to run ajax
                isLocal = false;
                
                
                var unsafeStop = stop,
                    unsafeStart = start,
                    isStopped = null;
                    
                stop = function(){
                    if(isStopped === null || !isStopped === false){
                        $env.log('PAUSING QUNIT');
                        isStopped = true;
                        unsafeStop(arguments);
                    }
                };
                start = function(){
                    if(isStopped === null || isStopped === true ){
                        $env.log('RESTARTING QUNIT');
                        isStopped = false;
                        unsafeStart(arguments);
                    }
                };
                //we know some ajax calls will fail becuase
                //we are not running against a running server
                //for php files
                var handleError = jQuery.handleError;
                jQuery.handleError = function(){
                    ok(false, 'Ajax may have failed while running locally');
                    try{
                        handleError(arguments);
                    }catch(e){}
                    //allow tests to gracefully continue
                    start();
                };
                //allow unanticipated xhr error with no ajax.handleError 
                //callback (eg jQuery.getScript) to exit gracefully
                $env.onInterrupt = function(){
                    $env.info('thread interupt: gracefully continuing test');
                    start();
                };
                
               
                $env.onScriptLoadError = function(script){
                    Envjs.error("failed to load script \n"+script.text);    
                    ok(false, 'Ajax may have failed to load correct script while running locally');
                    //allow tests to gracefully continue
                    start();
                };
            }
        }
    });
    
})(Envjs);
