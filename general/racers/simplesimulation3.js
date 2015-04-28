var Racer = require("./src/racer").racers.Racer;
var RaceTrack = require("./src/racetrack").racers.RaceTrack;
var async = require("async");
var db = require("./src/db");


console.log("Welcome spectators! It's time for the race of the century!");
var raceTrack = new RaceTrack();
var racers = [];

async.series([

    function(processdone) {
        db.create(function() {
            processdone(null);
        });
    },

    function(processdone) {
        db.getRacers(function(err, data) {
            if (err) {
                console.error("problem with db.getRacers:", err);
                // continue in this case, if we can...
            }
            racers = data;

            processdone(null);
        });
        
    },

    // Enter the racers.
    function(processdone) {
        var numRacers = 6;
        var i;
        var racer;
        
        for (i = 0; i < numRacers; i++) {
            racer = new Racer(racers[i]);
            console.log("%s has entered the race!", racer.get("name"));
            raceTrack.addEntry({
                racer: racer,
            });
        }
        
        processdone(null);
    },

    // Run the race.
    function(processdone) {
        console.log("Racers get ready!");
        
        // Initialize track conditions.
        raceTrack.applyVariance();
        
        console.log("Ready... set... go!");
        raceTrack.completeRace();
        
        processdone(null);
    },

    // Reporting.
    function(processdone) {
        var i;
        var standings = raceTrack.standings();
        console.log("What a race! And the standings are:");
        for (i = 0; i < standings.length; i++) {
            console.log("%d: %s traveled %d pixels.",
                i, standings[i].racer.get("name"), standings[i].distanceTraveled);
        }
        
        processdone(null);
    },

    // Saving stats.
    function(processdone) {
        var racer;
        var i;
        var racersToUpdate = [];
        
        console.log("Updating in memory statistics.");
        raceTrack.updateStats();
        for (i = 0; i < raceTrack.raceEntries.length; i++) {
            racer = raceTrack.raceEntries[i].racer;
            console.log("%d: %s has %d wins and %d losses.",
                i, racer.get("name"), racer.get("wins"), racer.get("losses"));
            racersToUpdate.push(racer);
        }
        
        console.log("Updating database statistics");
        racersToUpdate = racersToUpdate.map(function(racer) {
            return racer.toJSON();
        });
        db.updateRacerStats(racersToUpdate, function(err) {
            if (err) {
                processdone(err);
                return;
            }
            db.getRacers(function(err, data) {
                console.log("Dumping racer data after update");
                console.log(data);
                processdone(err);
            });
        });

    },

],
function(err, results) {
    if (err) {
        console.error("Got an error:", err);
    }
});