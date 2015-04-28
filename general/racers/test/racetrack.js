/*jshint loopfunc: true */
var RaceTrack = require("../src/racetrack").racers.RaceTrack;
var Racer = require("../src/racer").racers.Racer;



var raceTrack;
var numRacers = 6;

exports.setUp = function(done) {
    var i;
    var racer;

    raceTrack = new RaceTrack();
    
    for (i = 0; i < numRacers; i++) {
        racer = new Racer();
        racer.set("name", racer.get("name")+i);
        racer.set("number", i);
        raceTrack.addEntry({
            racer: racer,
        });
    }
    
    done();
};



exports["test racetrack"] = function(test) {
    
    test.ok(parseInt(raceTrack.raceSeed, 10), 
        "there is a numeric raceSeed.");
    test.ok(parseInt(raceTrack.distance, 10), 
        "there is a numeric distance.");
    test.strictEqual(parseInt(raceTrack.variance, 10), raceTrack.variance,
        "there is an integer variance");

    test.done();
};



exports["test racetrack entrants"] = function(test) {
    // Proving that addEntry in setup works ;)
    test.strictEqual(raceTrack.raceEntries.length, numRacers,
        "Expected number of racers.");

    test.done();
};



exports["test racetrack applyVariance"] = function(test) {
    var i;
    for (i = 0; i < raceTrack.raceEntries.length; i++) {
        raceTrack.raceEntries[i].calculateTrackSpeed = function(n) {
            test.strictEqual(typeof n, "number",
                "Received a number.");
        };
    }
    
    raceTrack.applyVariance();
    
    test.expect(numRacers);
    test.done();
};



exports["test racetrack stillRacing"] = function(test) {
    
    test.strictEqual(raceTrack.stillRacing(), true,
        "A fresh track should not have any finished racers.");
    
    test.done();
};



exports["test racetrack slowestSpeed"] = function(test) {
    console.log(raceTrack.slowestSpeed());
    test.strictEqual(raceTrack.slowestSpeed(), (new Racer()).get("speed"),
        "Default setup should have default racer speed.");

    test.done();
};



exports["test racetrack maxDistanceRemaining"] = function(test) {
    test.strictEqual(raceTrack.maxDistanceRemaining(), raceTrack.distance,
        "At the beginning, max distance is total distance.");
    test.done();
};



exports["test racetrack incrementRace"] = function(test) {
    var i;
    for (i = 0; i < raceTrack.raceEntries.length; i++) {
        raceTrack.raceEntries[i].incrementDistance = function(n) {
            test.strictEqual(typeof n, "number",
                "Received a number.");
        };
    }
    
    raceTrack.incrementRace(10);
    
    test.expect(numRacers);
    test.done();
};



exports["test racetrack completeRace"] = function(test) {
    raceTrack.completeRace();
    
    test.strictEqual(raceTrack.maxDistanceRemaining() <= 0, true,
        "when the race is done, no one has any distance left to trave.");
        
    test.done();
};



exports["test racetrack standings"] = function(test) {
    test.ok(Array.isArray(raceTrack.standings()),
        "Standings returns expected datatype.");
    test.strictEqual(raceTrack.standings().length, numRacers,
        "Expected number of entries listed.");        
    
    test.done();
};
