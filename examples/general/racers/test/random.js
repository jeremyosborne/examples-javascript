var racers = require("../src/random").racers;
var randomSeed = racers.randomSeed;
var random = racers.random;
var randint = racers.randint;

exports["random sanity test"] = function(test) {
    var expectedValues = [];
    var testValues = [];
    var seed = 12345;
    var i;
    
    randomSeed(seed);
    for (i = 0; i < 1000; i++) {
        expectedValues.push(random());
    }
    randomSeed(seed);
    for (i = 0; i < 1000; i++) {
        testValues.push(random());
    }
    
    test.deepEqual(testValues, expectedValues,
        "seeded random generator produces same results for same seed.");
    
    test.done();
};



exports["random sanity test"] = function(test) {
    var expectedValues = [];
    var testValues = [];
    var seed = 12345;
    var i;
    
    randomSeed(seed);
    for (i = 0; i < 1000; i++) {
        expectedValues.push(random());
    }
    randomSeed(seed);
    for (i = 0; i < 1000; i++) {
        testValues.push(random());
    }
    
    test.deepEqual(testValues, expectedValues,
        "seeded random generator produces same results for same seed.");
    
    test.done();
};



exports["random repetition test"] = function(test) {
    var values = {};
    var value;
    var maxtests = 1000;
    var seed = 12345;
    var i;
        
    randomSeed(seed);
    for (i = 0; i < maxtests; i++) {
        value = random();
        test.notEqual(values[value], true, 
            "Value has not been repeated.");
        values[value] = true;
    }
        
    test.done();
};



exports["randint sanity test"] = function(test) {
    var seed = 12345;
    var testval;
    var minval = -3;
    var maxval = 10;
    var maxtests = 10000;
    var i;
    
    randomSeed(seed);
    for (i = 0; i < maxtests; i++) {
        testval = randint(minval, maxval);
        test.ok(testval >= minval,
            "tesval is above min range.");
        test.ok(testval <= maxval,
            "tesval is above min range.");
        test.strictEqual(testval, parseInt(testval, 10),
            "should get an int back.");
    }
        
    test.done();
};
