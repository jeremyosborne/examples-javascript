var log = function(prefix) {
    return function() {
        var args = [prefix].concat(Array.prototype.slice.call(arguments));
        console.log.apply(console, args);
    };
};



var info = log("info:");
var err = log("ERROR:");

info("hello, this is some info.", ["and an array"]);
err("hello, this is an error.", {and: "an object"});
