var Racer = require("./src/racer").racers.Racer;
var RaceTrack = require("./src/racetrack").racers.RaceTrack;



console.log("Welcome spectators! It's time for the race of the century!");
var raceTrack = new RaceTrack();



// Enter the racers.
(function() {
    var numRacers = 6;
    var i;
    var racer;
    
    for (i = 0; i < numRacers; i++) {
        racer = new Racer();
        racer.set("name", racer.get("name")+i);
        racer.set("number", i);
        console.log("%s has entered the race!", racer.get("name"));
        raceTrack.addEntry({
            racer: racer,
        });
    }
})();



// Run the race.
(function() {
    console.log("Racers get ready!");
    
    // Initialize track conditions.
    raceTrack.applyVariance();
    
    console.log("Ready... set... go!");
    raceTrack.completeRace();    
})();



// Reporting.
(function() {
    var i;
    var standings = raceTrack.standings();
    console.log("What a race! And the standings are:");
    for (i = 0; i < standings.length; i++) {
        console.log("%d: %s traveled %d pixels.",
            i, standings[i].racer.get("name"), standings[i].distanceTraveled);
    }
})();
