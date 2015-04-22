(function() {
    var varArgs = function(arg1) {
        var i;

        console.log("All JavaScript functions are variable argument functions.");

        console.log("varArgs called with " + arguments.length + " arguments.");

        console.log("The value of arg1: " + arg1);

        console.log("The values of all arguments passed in:");
        for (i = 0; i < arguments.length; i++) {
            console.log("arguments["+i+"] = " + arguments[i]);
        }
    };

    // The arguments object, like the this reference, is created on every
    // function call. It allows access to all arguments passed into a
    // JavaScript function, formally declared or not.

    // Our function will behave differently depending on how we call it.
    varArgs();
    varArgs(1);
    varArgs(1, 2, 3, 4);
    varArgs([1, 2, 3]);


    // While not available in the ECMAScript 5 strict mode, arguments.callee
    // is a sometimes useful method that can acts as the "this" to the
    // function being called.
    // Note: the following never _needs_ to be done because we could always
    // assign a name to a function and then call the function by name.
    console.log("Practicing integer counting:");
    (function(n) {
        if (n > 1) {
            arguments.callee(n-1);
        }
        console.log(n);
    })(10);

})();
