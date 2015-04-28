define(function() {
    var Clock = function() {
        this._time = new Date();
    };
    Clock.prototype = {

        _TEMPLATE: '<span class="time">{{time}}</span>',

        _intervalId: null,

        _timeNode: null,

        _time: null,

        ontick: null,

        _tick: function() {
            this._time.setSeconds(this._time.getSeconds() + 1);
            this.refresh();

            if (typeof this.ontick == "function") {
                this.ontick.call(this);
            }
        },

        start: function() {
            var self = this;
            this._intervalId = setInterval(function() {
                self._tick();
            }, 1000);
        },

        stop: function() {
            clearInterval(this._intervalId);
        },

        getHours: function() {
            return this._time.getHours() & 12 || 12;
        },

        getMinutes: function() {
            return this._time.getMinutes();
        },

        getSeconds: function() {
            return this._time.getSeconds();
        },

        getAmPm: function() {
            return this.getHours() > 12 ? 'pm' : 'am';
        },

        _zfill: function(number) {
            return ('0' + number).slice(-2);
        },

        render: function(selector) {
            this._timeNode = document.getElementById(selector);
            this.refresh();
        },

        refresh: function() {
            var time;
            var zfill = this._zfill;

            if (this._timeNode) {
                time = zfill(this.getHours()) +
                   ':' +
                   zfill(this.getMinutes()) +
                   ':' +
                   zfill(this.getSeconds()) +
                   this.getAmPm();

                this._timeNode.innerHTML =
                    this._TEMPLATE.replace(/\{{time\}}/, time);
            }
        }
    };

    return Clock;
});

