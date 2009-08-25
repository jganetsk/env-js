/*
*	outro.js
*/


    };// close function definition begun in 'intro.js'


    // turn "original" JS interpreter global object into the
    // "root" window object; third param value for new window's "parent"
    Envjs.window(this, Envjs, null, this);

} catch(e){
    Envjs.error("ERROR LOADING ENV : " + e + "\nLINE SOURCE:\n" +
        Envjs.lineSource(e));
}
