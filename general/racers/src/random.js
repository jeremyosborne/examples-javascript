(function(exports) {

    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;



    var seed = 12345;
    var range = Math.pow(2, 32)-3;



    m.randomSeed = function(s) {
        if (typeof s == "number") {
            seed = s;
        }
    };
    
    
    
    m.random = function() {
        seed = seed * 7;
        seed = ((Math.sin(seed) * range) % range) / range;
        return Math.abs(seed);
    };
    
    
    
    m.randint = function(min, max) {
        return min + Math.round(m.random()*(max-min)); 
    };
    
})(this);
