// Closure, simply described as an effect, is the ability of inner functions
// to access outer function variables over time, and after the initial call
// stack has ended.

// Examples:
// Everytime we call this function, it creates and returns a function that
// has access to the locally scoped randomNumber variable.
// The returned function will keep a reference to this variable over time.
var numberFnGenerator = function() {
    var randomNumber = Math.floor(Math.random() * 1000);
    return function() {
        return randomNumber;
    };
};

var f1 = numberFnGenerator();
// same results over time.
console.log( f1() );
console.log( f1() );
// different from f1, but same results over time for each call to f2.
var f2 = numberFnGenerator();
console.log( f2() );
console.log( f2() );



// COMMON ERROR
// Inner functions remember references (like pointers), not values.
// The following is a classic misuse of closure in an iterative loop.
var list = (function() {
    var a = [];
    var i;

    for (i = 0; i < 5; i++) {
        a[i] = function() {
            return i;
        };
    }

    return a;
})();
// When we iterate list, all of the functions will return the value of 5.
console.log("Iterating over the list of functions...")
for (var i = 0; i < list.length; i++) {
    console.log( list[i]() );
}
