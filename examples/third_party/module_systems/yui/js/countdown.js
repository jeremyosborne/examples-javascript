YUI.add("countdown", function(Y) {

    var _MS_PER_HOUR = 1000*60*60;
    var _MS_PER_MINUTE = 1000*60;
    var _MS_PER_SECOND = 1000;

    var Countdown = function(seconds) {
        Y.Clock.call(this);

        this._alarm = new Date();
        this._alarm.setSeconds(this._alarm.getSeconds() + seconds);
    };
    Countdown.prototype = new Y.Clock();
    Countdown.prototype._alarm = null;
    Countdown.prototype.onalarm = null;
    Countdown.prototype._alarmFired = false;
    Countdown.prototype._msLeft = function() {
        var msLeft = this._alarm.getTime() - this._time.getTime();
        if (!this._alarmFired && msLeft <= 0
            && typeof this.onalarm == "function") {
            this._alarmFired = true;
            this.onalarm.call(this);
            this.stop();
        }
        return msLeft;
    };
    Countdown.prototype.getAmPm = function() {
        return "";
    };
    Countdown.prototype.getHours = function() {
        var hours = Math.floor(this._msLeft() / _MS_PER_HOUR);
        return hours >= 0 ? hours : 0;
    };
    Countdown.prototype.getMinutes = function() {
        var minutes = Math.floor(this._msLeft() % _MS_PER_HOUR / _MS_PER_MINUTE);
        return minutes >= 0 ? minutes : 0;
    };
    Countdown.prototype.getSeconds = function() {
        var seconds = Math.floor(this._msLeft() % _MS_PER_HOUR % _MS_PER_MINUTE / _MS_PER_SECOND);
        return seconds >= 0 ? seconds : 0;
    };

    Y.Countdown = Countdown;

}, "0.0.1", { "requires": ["clock"] });
