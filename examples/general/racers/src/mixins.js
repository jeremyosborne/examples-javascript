(function(exports) {

    var m;
    if (!exports.racers) {
        exports.racers = {};
    }
    m = exports.racers;


    
    m.getsetMixin = {
        get: function(key) {
            if (this.data) {
                return this.data[key];
            }
        },
        set: function(key, val) {
            if (this.data) {
                this.data[key] = val;
            }
        }
    };



    
    m.serializationMixin = {
        toJSON: function() {
            var o = {};
            if (this.data) {
                o = JSON.parse(JSON.stringify(this.data));
            }
            return o;
        },
        fromJSON: function(o) {
            // Side effects, be careful.
            if (typeof o == "string") {
                o = JSON.parse(o);
            }
            this.data = o;
        }
    };

})(this);
