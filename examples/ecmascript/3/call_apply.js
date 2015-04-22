(function() {
    var myself = {
        value: 1
    };
    var other1 = {
        value: 2
    };
    var other2 = {
        value: 3
    };
    var addNumber = function(o1, o2) {
        console.log("The value of myself and the others is:");
        console.log(this.value + o1.value + o2.value);
    };

    // Call and apply are Function methods used to coerce the value of this
    // within a function. They are essentially the same function, but allow
    // for different flexibility when programming.

    // The signature of call is:
    // someFunction.call(thisArg, arg1, arg2, ...);
    // where the first argument becomes the this of the function
    // and any remaining arguments are passed in as the formal arguments to
    // the function.
    addNumber.call(myself, other1, other2);


    // The signature of apply is:
    // someFunction.apply(thisArg, [arg1, arg2, ...]);
    // where the first argument becomes the this of the function
    // and the second argument, which if included must be an array, is broken
    // out and the elements of the array are passed into the function as
    // the formal arguments.
    addNumber.apply(myself, [other1, other2]);

})();
