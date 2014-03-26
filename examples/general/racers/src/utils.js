(function(exports) {

    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;



    m.mapMissing = function(target, mixin) {
        var i;
        target = target || {};
        for (i in mixin) {
            if (mixin.hasOwnProperty(i) && target[i] === undefined) {
                target[i] = mixin[i];
            }
        }
        return target;
    };
    
})(this);
