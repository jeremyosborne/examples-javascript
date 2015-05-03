(function(exports){



//--------------------------------------------------------- Util functions
/*
 * Zero fills a two-digit number.
 * @param num {Number} The number to zero fill.
 * @return {String} The zero-filled number.
 */
var zeroFillTwo = function (num) {
    num = num.toString();
    if (num.length == 1) {
        num = "0"+num;
    }
    return num;
};


//--------------------------------------------------------- Public
/**
 * @class A simple timer class designed for managing clock type objects. This
 * object is _not_ designed for solving problems that need precise time
 * measurements, profiling, or timing performance issues.
 * @description Construct a timer. Can be called with or without new.
 * @example
 * // Create a new timer
 * var increasing = SimpleTimer();
 * // subscribe a function to the "tick" event (which is set to fire every
 * // second).
 * increasing.subscribe("tick", doSomething);
 * // Start the clock, that will run from now into the future.
 * increasing.start();
 * @name SimpleTimer
 */
exports.SimpleTimer = function() {
        // Self reference and our timer object.
    var self = Object.create(EventEmitter.prototype),
        /*
         * ID of the currently queued up timer event.
         * @private
         * @type number|string|whatever the browser uses as a setTimeout id
         */
        lastSetTimeoutId;

    //--------------------------------------------------- Events Published
    /**
     * Triggered every second that the timer runs.
     * @name tick
     * @memberOf SimpleTimer
     * @event
     * @param now {Date} The current time, within the context of the
     * timer (e.g. if the clock is running in countdown mode, this would be
     * the remaining amount of time).
     */

    //--------------------------------------------------- Private Methods
    /**
     * The timer run loop.
     */
    var runTimer = function() {
        // TODO: When I figure out what I want for an extended date object,
        // formalize it and refactor it out.
        self.emit("tick", {
            // Reference to the JavaScript Date.
            date: new Date(),
            // Analog hours
            hours: function() {
                return this.date.getHours();
            },
            zfhours: function() {
                return zeroFillTwo(this.hours());
            },
            ahours: function() {
                // a for analog
                var hours = this.hours();
                return hours >= 12 ? hours - 12 : (!hours ? 12 : hours);
            },
            // zero filled analog hours
            zfahours: function() {
                // a for analog
                return zeroFillTwo(this.ahours());
            },
            minutes: function() {
                return this.date.getMinutes();
            },
            // zero filled minutes
            zfminutes: function() {
                return zeroFillTwo(this.minutes());
            },
            seconds: function() {
                return this.date.getSeconds();
            },
            // zero filled seconds
            zfseconds: function() {
                return zeroFillTwo(this.seconds());
            },
            // Forward some function calls
            time: function() {
                return this.date.getTime();
            }
        });
        lastSetTimeoutId = setTimeout(runTimer, 1000);
    };
    /**
     * Stops the timer run loop.
     */
    var stopTimer = function() {
        if (lastSetTimeoutId) {
            clearTimeout(lastSetTimeoutId);
        }
    };

    //--------------------------------------------------- Public Methods
    /**
     * Allow external objects to subscribe to published timer events.
     * @example
     * // Assuming we've made a timer object already called "timer"
     * // Subscribe a function to the tick event.
     * timer.subscribe("tick", myTicker);
     * // Subscribe another function to the tick event, and change the
     * // this reference during the call to another object.
     * timer.subscribe("tick", myTicker2, myThis);
     */
    // NOTE: The subscribe method is mixed in during construction and is not
    // explicitly defined here.

    /**
     * Starts the clock.
     * @name start
     * @methodOf SimpleTimer
     */
    self.start = function() {
        runTimer();
    };
    /**
     * Stops the running of the clock, which also ceases the triggering
     * of events.
     * @name stop
     * @methodOf SimpleTimer
     */
    self.stop = function() {
        stopTimer();
    };

    // Allow other elements to subscribe to this.
    makePublisher(self);
    // Pass back the constructed self.
    return self;
};



})(this);
