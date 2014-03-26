/*global require:false */
(function(exports) {

    // One of the following will work.
    var randomSeed;
    var randint;
    var RaceEntry;
    try {
        randomSeed = require("./random").racers.randomSeed;
        randint = require("./random").racers.randint;
        RaceEntry = require("./raceentry").racers.RaceEntry;
    }
    catch(e) {}
    try {
        randomSeed = window.racers.randomSeed;
        randint = window.racers.randint;
        RaceEntry = window.racers.RaceEntry;
    }
    catch(e) {}
    
    // Setup export.
    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;



    var RaceTrack = function(cnf) {
        var i;
        
        this.raceEntries = [];
    };
    RaceTrack.prototype = {
        raceSeed: 12345,
        
        distance: 1000,
        
        // Can be a bonus or penalty.
        variance: 20,   // units per second, will be converted

        addEntry: function(cnf) {
            this.raceEntries.push(new RaceEntry(cnf));
        },

        applyVariance: function() {
            // Determines the variance for each driver. This should be
            // calculated once for each race. 
            // The remainder of the race is deterministic.
            var i;
            for (i = 0; i < this.raceEntries.length; i++) {
                this.raceEntries[i].calculateTrackSpeed(
                    // Before passing on, convert to change per millisecond.
                    randint(-this.variance, this.variance)/1000
                );
            }
        },
        
        stillRacing: function() {
            // Is there any driver that has not completed the distance?
            var i;
            
            for (i = 0; i < this.raceEntries.length; i++) {
                if (this.raceEntries[i].distanceTraveled < this.distance) {
                    return true;
                }
            }
            return false;
        },
        
        slowestSpeed: function() {
            // What is the slowest speed of any of the entrants?
            var i;
            var slowestSpeed = Infinity;
            
            for (i = 0; i < this.raceEntries.length; i++) {
                slowestSpeed = Math.min(slowestSpeed, this.raceEntries[i].trackSpeed);
            }
            return slowestSpeed;
        },
        
        maxDistanceRemaining: function() {
            // What is the max distance remaining of any entrant?
            var i;
            var maxDistance = 0;
            
            for (i = 0; i < this.raceEntries.length; i++) {
                maxDistance = Math.max(maxDistance, 
                    this.distance - this.raceEntries[i].distanceTraveled);
            }
            return maxDistance;
        },

        incrementRace: function(dt) {
            // dt in ms, calculate how far each car has traveled in the simulation.
            var i;
            for (i = 0; i < this.raceEntries.length; i++) {
                this.raceEntries[i].incrementDistance(dt);
            }
        },
        
        completeRace: function() {
            // If any driver has not completed the simulation, finish
            // the simulation.
            var timeRemaining = this.maxDistanceRemaining() / this.slowestSpeed();

            this.incrementRace(timeRemaining);
        },
        
        standings: function() {
            // If the race is over, return sorted list of winners.
            var standings = this.raceEntries.slice();
            standings.sort(function(a, b) {
                // We want a reverse sort.
                return b.distanceTraveled - a.distanceTraveled;
            });
            
            return standings;
        },

        updateStats: function() {
            var winner;
            var racer;
            var i;
            if (!this.stillRacing()) {
                winner = this.standings()[0].racer.get("name");

                for (i = 0; i < this.raceEntries.length; i++) {
                    racer = this.raceEntries[i].racer;
                    if (racer.get("name") === winner) {
                        // A winner is y0u!
                        racer.set("wins", racer.get("wins")+1);
                    }
                    else {
                        // A winner is y0u!
                        racer.set("losses", racer.get("losses")+1);                        
                    }
                }
            }
        }
    };
    
    m.RaceTrack = RaceTrack;

})(this);

