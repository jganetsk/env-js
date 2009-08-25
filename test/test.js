// Init
load("dist/env.rhino.js");

// Must upgrade Rhino to 1.7R2 for this function to work.
// function crankyLoad() {
//   var context = Packages.org.mozilla.javascript.Context.currentContext;
//   var SourceReader = Packages.org.mozilla.javascript.tools.SourceReader;
//       
//   for(var i=0; i < arguments.length; i++) {
//     var filename = arguments[i];
//     var source = SourceReader.readFileOrUrl(filename, true, "UTF-8");
//     context.evaluateString(this, source, filename, 0, null);
//   }
// }

window.onload = function(){
  print("Handling onload for test.js");

  // Load the test runner
  load("test/testrunner.js");
  print("Loaded test runner.");
  
  var start = new Date().getTime();
  print("Loading tests.");
  // Load the tests
  load(
    "test/unit/dom.js",
    "test/unit/window.js",
    "test/unit/onload.js",
    "test/unit/scope.js",     // must come before frame.js changes page content
    "test/unit/frame.js",
    "test/unit/events.js",
    "test/unit/parser.js",
    "test/unit/timer.js",
    //NOTE: keep this test last because Prototype pollutes
    //the namespace and several DOM objects
    "test/unit/prototypecompat.js"
  );
  var end = new Date().getTime();
  
  
  // Display the results
  results();
  
  var tab = "                ";//16
  print("\n\nTOTAL TIME : " + (end - start)/1000 + " SECONDS");
  print("\nPROFILE");
  print("ASPECT \n" +  
        " | # OF CALLS "+tab.substring(0,tab.length-String(calls).length)+ 
        " | MIN "+tab.substring(0,tab.length-"MIN".length)+
        " | MAX "+tab.substring(0,tab.length-"MAX".length)+
        " | AVG "+tab.substring(0,tab.length-"AVG".length)+
        " | OWN "+tab.substring(0,tab.length-"OWN".length)+" |");
  for( var profile in window.$profile){
        var stats = window.$profiler.stats(window.$profile[profile].times);
        var calls = window.$profile[profile].callCount;
        print(  profile+" \n | "+
                calls+" "+tab.substring(0,tab.length-String(calls).length)+" | "+
                stats.min+" "+tab.substring(0,tab.length-String(stats.min).length)+" | "+
                stats.max+" "+tab.substring(0,tab.length-String(stats.max).length)+" | "+
                stats.avg+" "+tab.substring(0,tab.length-String(stats.avg).length)+" | "+
                stats.own+" "+tab.substring(0,tab.length-String(stats.own).length)+" |");
  }
  
};

window.location = "test/index.html";