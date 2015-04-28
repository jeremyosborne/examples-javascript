var RaceEntry = require("../src/raceentry").racers.RaceEntry;

exports["test RaceEntry"] = function(test) {

    test.throws(function() {
        new RaceEntry();
    }, Error, "Can't build a RaceEntry without a racer.");
    
    var mock = {"dummy": "value", get: function() {}};
    var entry = new RaceEntry({
        racer: mock
    });
    test.deepEqual(entry.racer, mock,
        "expected value.");
    
    test.done();
};
