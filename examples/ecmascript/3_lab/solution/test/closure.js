var proceduresToRun = require("../src/closure");



exports.testProceduresToRun = function(test){
    var i;
    for (i = 0; i < proceduresToRun.length; i++) {
        test.strictEqual(proceduresToRun[i](), i, 
            "Expect return value to equal the index of procedure.");
    }
    
    test.done();
};
