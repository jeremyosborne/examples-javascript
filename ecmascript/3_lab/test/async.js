var delay = require("../src/async").delay;



exports.testDelay = function(test){
    test.expect(1);

    delay(function(dt) {
        test.strictEqual(typeof dt, "number",
            "Expect a numeric delta time passed.");
    });
    
    test.done();
};
