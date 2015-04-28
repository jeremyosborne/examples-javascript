var mapMissing = require("../src/utils").racers.mapMissing;

exports["test mapMissing"] = function(test) {
    var original = {
        "hello": "world",
    };
    var updated = {
        "hello": "test",
        "and": "universe",
    };
    
    original = mapMissing(original, updated);
    
    test.strictEqual(original.hello, "world",
        "default values are not overwritten.");
    test.strictEqual(original.and, "universe",
        "missing values are added.");
    
    test.done();
};
