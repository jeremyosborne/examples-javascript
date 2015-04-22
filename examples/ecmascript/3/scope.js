// Variable scope in JavaScript is functional, as well as supporting the idea
// of global scope. (Global in the browser is the window object.)

// Some examples:

console.log("Global variable test.");
var x = 10;
(function() {
    console.log("The value of x is " + x);
    x = 20;
    console.log("The value of x is now " + x);
})();
console.log("The value of (global) x is now " + x);



console.log("Local vs. global scoped variables.");
(function() {
    var x = 50;
    console.log("The value of x is " + x);
    x = 100;
    console.log("The value of x is now " + x);
})();
console.log("The value of (global) x is still " + x);



console.log("Inner vs. outer vs. global scoped variables.");
(function() {
    var x = 50;
    console.log("The value of x in the outer function is " + x);

    (function() {
        var x = 100;
        console.log("The value of x in the first inner function is " + x);
    })();

    console.log("The value of x in the outer function is still " + x);

    (function() {
        console.log("The value of x in the second inner function is " + x);
        x = 5000;
    })();

    console.log("The value of x in the outer function is now" + x);
})();
console.log("The value of (global) x is still " + x);



// Variable hoisting (invisible variable declaration at the top of the
// function) is partly why JavaScript does not have block-scoped variables.
console.log("no blocked scope variables in JavaScript");
(function() {
    for (var i = 0; i < 10; i++) {
        // do nothing....
    }
    console.log("the value of i outside of the for loop is: " + i);
})();



// In a JavaScript function, variables are declared once, and the declaration
// happens invisibly at the top of the function no matter where the var ...
// statement happens within the function.
console.log("Beware the accidental errors caused by variable hoisting.");
(function() {
    // Invisibly, the variable declaration happens here although the
    // assignment still happens below within the block.
    // var console;

    if (!console) {
        var console = {};
        console.log = function(message) {
            alert(message);
        };
    }
    // Note: Normally console log is available in our modern browser, but
    // this function acts like it isn't available.
    // Luckily, the way we declared this won't screw up the global console.
    console.log("hello world");
})();
