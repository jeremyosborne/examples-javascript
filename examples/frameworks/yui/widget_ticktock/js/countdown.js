YUI.add("countdown", function(Y) {

    var _MS_PER_HOUR = 1000*60*60;
    var _MS_PER_MINUTE = 1000*60;
    var _MS_PER_SECOND = 1000;
    
    var Countdown = Y.Base.create("countdown", Y.Clock, [], {
        initializer: function(args) {
            var a = this.get("_alarm");
            a.setSeconds(a.getSeconds() + args.seconds);
            this.set("_alarm", a);
            
            this.on("tick", function() {
                if (!this._alarmFired && this._msLeft() <= 0) {
                    this._alarmFired = true;
                    this.fire("alarm");
                    this.stop();
                }
            });
        },

        _alarmFired: false,

        _msLeft: function() {
            var msLeft = this.get("_alarm").getTime() - this.get("_time").getTime();
            return msLeft;
        },
        
        getAmPm: function() {
            return "";
        },
        
        getHours: function() {
            var hours = Math.floor(this._msLeft() / _MS_PER_HOUR);
            return hours >= 0 ? hours : 0;
        },
        
        getMinutes: function() {
            var minutes = Math.floor(this._msLeft() % _MS_PER_HOUR / _MS_PER_MINUTE);
            return minutes >= 0 ? minutes : 0;
        },
        
        getSeconds: function() {
            var seconds = Math.floor(this._msLeft() % _MS_PER_HOUR % _MS_PER_MINUTE / _MS_PER_SECOND);
            return seconds >= 0 ? seconds : 0;
        }
    },
    {
        ATTRS: {
            _alarm: {
                valueFn: function () {
                    return new Date();
                },
                validator: Y.Lang.isDate
            },
    
        }
    });
    
    Y.Countdown = Countdown;

}, "0.0.1", {
    requires: ["node", "clock"]
});


