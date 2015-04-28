var messenger = require("../src/hoisting").messenger;



exports.testMessenger = function(test){
    test.strictEqual(messenger.log(), "default log message.", 
        "Expect the default log message in test environment.");
    
    test.done();
};
