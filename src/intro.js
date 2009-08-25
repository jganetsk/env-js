


try {
        
    Envjs.window = function($w, 
                            $env,
                            $parentWindow,
                            $initTop){

    // The Window Object
    var __this__ = $w;
    $w.__defineGetter__('window', function(){
        return __this__;
    });

