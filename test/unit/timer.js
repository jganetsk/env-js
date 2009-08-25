module("timer");

test("runnable callbacks are run immediately with timeout of 0", function() {
	expect(1);
	var occurred = 0;
	setTimeout(function(){ 
        occurred = Date.now(); 
    }, 0);
	ok( occurred !== 0, "Timeout callback was executed immediatly" );
});

test("runnable callbacks are run later with timeout more than 0", function() {
	expect(1);
	var occurred = 0;
	setTimeout(function(){ 
        occurred = Date.now(); 
    }, 1000);
	ok( occurred === 0, "Timeout callback was not executed immediatly" );
    java.lang.Thread.currentThread().sleep(1500);
});

test("setTimeout execution runs callback after timeout period", function() {
	expect(3);
	var occurred = 0;
	setTimeout(function(){ 
        occurred = Date.now();
	    ok( true, "callback was executed" );
    }, 1000);
	ok( occurred === 0, "Timeout callback was not executed immediatly" );
    java.lang.Thread.currentThread().sleep(3000);
	ok( occurred !== 0, "Timeout callback was executed" );
});


test("clearTimeout cancels execution of setTimeout callback", function() {
	expect(2);
	var occurred = 0;
	var id = setTimeout(function(){ 
        occurred = Date.now();
	    ok( false, "callback should not executed after clearTimeout" );
    }, 1000);
	ok( occurred === 0, "Timeout callback was not executed immediatly" );
    clearTimeout(id);
    java.lang.Thread.currentThread().sleep(3000);
	ok( occurred === 0, "Timeout callback was not executed" );
});


