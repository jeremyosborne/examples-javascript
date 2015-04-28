var mapMissing = require("../src/utils").racers.mapMissing;
var getsetMixin = require("../src/mixins").racers.getsetMixin;
var serializationMixin = require("../src/mixins").racers.serializationMixin;



exports["test getsetMixin"] = function(test) {
    var o = {};
    mapMissing(o, getsetMixin);
    test.strictEqual(o.get("test"), undefined,
        "Expected default value.");
    o.set("test", "hello");
    test.strictEqual(o.get("test"), undefined,
        "Expected value when no data property.");    
    
    
    
    o = {
        data: {},
    };
    mapMissing(o, getsetMixin);

    test.strictEqual(o.get("test"), undefined,
        "Expected default value.");
    o.set("test", "hello");
    test.strictEqual(o.get("test"), "hello",
        "Expected set value.");

    test.done();
};



exports["test serializationMixin toJSON"] = function(test) {
    var o = {};
    mapMissing(o, serializationMixin);
    test.deepEqual(o.toJSON(), {},
        "Empty objects return expected results.");    
    
    
    o = {
        data: {
            "color": "red",
            "tires": "black",
        }
    };
    mapMissing(o, serializationMixin);
    test.deepEqual(o.toJSON(), {
            "color": "red",
            "tires": "black",
    }, "Underlying data property is serialized.");

    test.done();
};



exports["test serializationMixin fromJSON"] = function(test) {
    var o = {};
    mapMissing(o, serializationMixin);
    o.fromJSON({
        "hello": "world"
    });
    test.strictEqual(o.data.hello, "world",
        "Expected results from object.");

    o.fromJSON('{"hello":"world"}');
    test.strictEqual(o.data.hello, "world",
        "Expected results from JSON string.");
    
    test.done();
};
