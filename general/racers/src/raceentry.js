/*global require:false */
(function(exports) {

    // Setup export.    
    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;

    var RaceEntry = function(cnf) {
        if (cnf.racer) {
            this.racer = cnf.racer;
        }
        else {
            throw new Error("Must have a racer.");
        }
        
        // Initialize.
        this.trackSpeed = this.racer.get("speed");
    };
    RaceEntry.prototype = {
        // Tracking how far we have actually traveled. 
        distanceTraveled: 0,
        // How fast are we calculated for travel on this track.
        trackSpeed: 0,
        
        calculateTrackSpeed: function(variance) {
            this.trackSpeed = variance + this.racer.get("speed");
        },
        
        incrementDistance: function(dt) {
            // Over a delta number of milliseconds, set our distance.
            this.distanceTraveled += this.trackSpeed * dt;
        }
    };
    m.RaceEntry = RaceEntry;

})(this);

