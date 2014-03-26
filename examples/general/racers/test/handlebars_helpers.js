var Handlebars = require("handlebars");
require("../src/handlebars_helpers");

exports["test get helper"] = function(test) {
    var fragment = "{{#get racer data='number'}}{{/get}}";
    var template = Handlebars.compile(fragment);
    var mock = {
        racer: {
            get: function(key) {
                test.strictEqual(key, "number",
                    "Passes the correct key.");
            }
        }
    };
    
    template(mock);
    
    
    test.done();
};
