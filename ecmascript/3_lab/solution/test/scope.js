var blockscope = require("../src/scope").blockscope;



exports.testBlockscope = function(test){
    test.strictEqual(blockscope(), "status", 
        "Expect a status string to be returned.");
    
    test.done();
};
