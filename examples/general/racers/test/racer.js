var Racer = require("../src/racer").racers.Racer;

exports["test racer"] = function(test) {
    var r = new Racer();
    
    test.strictEqual(r.get("name"), "Hanz",
        "expected default value");
    test.strictEqual(r.get("number"), 1,
        "expected default value");
    test.strictEqual(r.get("carColor"), "red",
        "expected default value");
    test.strictEqual(r.get("speed"), 10/100,
        "expected default value");
    test.strictEqual(r.get("wins"), 0,
        "expected default value");
    test.strictEqual(r.get("losses"), 0,
        "expected default value");
        
    test.done();
};
