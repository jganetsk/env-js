/*
*	timer.js
*/
	

$debug("Initializing Window Timer.");

//private
var $timers = [];

window.setTimeout = function(fn, time){
  var num;
  return num = window.setInterval(function(){
    fn();
    window.clearInterval(num);
  }, time);
};

window.setInterval = function(fn, time){
	var num = $timers.length;
	
    if (typeof fn == 'string') {
        var fnstr = fn; 
        fn = function() { 
            eval(fnstr); 
        }; 
    }
	if(time===0){
	    fn();
	}else{
	    //$debug("Creating timer number "+num);
    	$timers[num] = new $env.timer(fn, time);
    	$timers[num].start();
	}
	return num;
};

window.clearInterval = window.clearTimeout = function(num){
	//$log("clearing interval "+num);
	if ( $timers[num] ) {
	    
		$timers[num].stop();
		delete $timers[num];
	}
};	
	