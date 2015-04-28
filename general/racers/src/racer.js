/*global require:false */
(function(exports) {

    // One of the following will work.
    var mapMissing;
    var serializationMixin;
    var getsetMixin;
    try {
        mapMissing = require("./utils").racers.mapMissing;
        serializationMixin = require("./mixins").racers.serializationMixin;
        getsetMixin = require("./mixins").racers.getsetMixin;
    }
    catch(e) {}
    try {
        mapMissing = window.racers.mapMissing;
        serializationMixin = window.racers.serializationMixin;
        getsetMixin = window.racers.getsetMixin;
    }
    catch(e) {}
    
    // Setup export.    
    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;



    var defaults = {
        name: "Hanz",
        carColor: "red",
        speed: 100/1000,      // Units (pixels) per millisecond.
        number: 1,
        wins: 0,
        losses: 0
    };

    var Racer = function(cnf) {
        // Normalize then shallow copy.
        cnf = mapMissing(cnf, defaults);
        this.data = mapMissing({}, cnf);        
    };
    mapMissing(Racer.prototype, serializationMixin);
    mapMissing(Racer.prototype, getsetMixin);

    m.Racer = Racer;

})(this);

