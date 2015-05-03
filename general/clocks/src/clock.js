/*
 * @fileoverview Simple clock class.
 * @author Jeremy Osborne
 *
 * @requires simpletimer
 */

/**
 * @class A utility clock class for timing, alarms, notifications, etc.
 * @description Construct a new Clock object. Can be called with or without
 * new.
 *
 * @example
 * // Need to designate a container for the clock
 * var div = document.getElementById("my-clock-container");
 * // Create the clock, with the default diameter
 * var clock = Clock(div)
 * // Run it
 * clock.start()
 *
 * @param cDiv {DOM Element} A DIV element on the page that will
 * contain this clock.
 * @param [diam] {number} The pixel diameter of the clock. This will
 * also become the width and height of the canvas element that the clock is
 * drawn inside of.
 */
window.Clock = function(clockDiv, diam) {
        /**
         * Internal self reference.
         * @private
         */
    var self = {},
        /**
         * All drawing functions are based on a 100px radius clock
         * and are scaled thusly. If writing new drawing functions, remember this.
         * @private
         * @default 200
         */
        defaultDiameter = 200,
        /**
         * The pixel size of the clock that will also translate into the height
         * and the width of the canvas on which the visual clock will be drawn.
         * We only deal with circular clocks and square canvases.
         * @private
         * @type number
         */
        diameter = diam || defaultDiameter,
        /**
         * The radius of the circular clock that acts as a convenience reference
         * for the clock drawing calculations.
         * @private
         * @type number
         * @default diameter/2
         */
        radius = diameter / 2,
        /**
         * Reference to the canvas DOM element where the clock will be drawn. This
         * element is created on the fly.
         * @private
         */
        clockCanvas,
        /**
         * Reference to the canvas context on where the clock will be drawn.
         * @private
         */
        ctx,
        /**
         * Date object representing the current system time.
         * @private
         * @type Object (An extended date like object, see the simpletimer docs)
         */
        now,
        /**
         * The time at which the alarm event will fire, if set.
         * @private
         * @type Date
         */
        alarm,
        /**
         * The events to fire when the alarm goes off.
         * @private
         * @type Array
         */
        alarmEvents = [],
        /**
         * Keeps track of the time.
         * @type SimpleTimer
         */
        timer = SimpleTimer(),
        /**
         * The queued up setTimeout id that can be used to cancel the running
         * of the clock.
         * @private
         * @type setTimout id
         */
        nextTimeoutId;

    //------------------------------------------------------- Private Functions
    /**
     * Should be called only when the clock is running.
     * If the time is passed the alarm, fire off the onalarm event.
     */
    function checkAlarm() {
        if (alarm && (alarm.getTime() <= now.time())) {
            triggerAlarmEvents();
            // Alarm is not reocurring at the moment.
            alarm = null;
        }
    }

    /**
     * Runs all alarm events and then empties the alarm event queue.
     */
    function triggerAlarmEvents() {
        var i,
            triggerThis;

        for (i = 0; i < alarmEvents.length; i++) {
            triggerThis = alarmEvents[i];
            if (typeof(triggerThis) == "function") {
                // Should I pass in now or the alarm? I think the alarm.
                triggerThis(alarm);
            }
            else {
                // We got a string
                alert(triggerThis);
            }
        }
        // Empty the queue the easy way
        alarmEvents = [];
    }

    /**
     * The "tick" event listener, subscribed to the timer.
     * @param time {Object} A modified, date-like object made available from
     * the timer.
     */
    function updateTime(time) {
        // Set initial time
        now = time;

        drawClock();
        checkAlarm();
    }

    /**
     * Draws the clock at the current time.
     * Mainly called by the draw function.
     */
    function drawClock() {
        // Scale the clock according to the ratio of our default diameter.
        var scaleFactor = diameter/defaultDiameter;

        // We want to end up at the same state as we began, a courtesy
        ctx.save();

        // Clean off the old clock
        ctx.clearRect(0, 0, diameter , diameter);

        // Setup our central drawing point from the center of the clock's canvas
        ctx.translate(radius, radius);

        ctx.scale(scaleFactor, scaleFactor);

        // Due to how canvas handles angular rotation around the origin
        // this initial rotation transforms horizontal lines to vertical
        // 12 o'clock lines. This makes the following time calculations
        // easier and relative from the "straight up" position.
        ctx.rotate(-Math.PI/2);

        // Draw the phantom alarm hands if the alarm is set, draw it first
        if (alarm) {
            drawAlarmHourHand();
            drawAlarmMinuteHand();
            drawAlarmSecondHand();
        }

        // Draw out the clock
        drawHourMarks();
        drawMinuteMarks();
        drawHourHand();
        drawMinuteHand();
        drawSecondHand();
        drawClockFace();

        // Restore the transformation stack to where it was before we started
        ctx.restore();
    }

    /**
     * Paint the alarm "phantom" hour hand.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     */
    function drawAlarmHourHand() {
        var alarmHours = alarm.getHours(),
            alarmAhr = alarmHours>=12 ? alarmHours-12 : alarmHours;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Drawing constraints for the hour hand
        // Extend the hour hand beyond the center
        var begin = -22;
        var end = 55;
        // Style the hour Hand
        ctx.lineWidth = 7;
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineCap = "round";

        // Rotate based on the current fractions of time
        ctx.rotate(alarmAhr*(Math.PI/6) + (Math.PI/360)*alarm.getMinutes() + (Math.PI/21600)*alarm.getSeconds());
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paint the alarm "phantom" minute hand.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     */
    function drawAlarmMinuteHand() {
        // Drawing constraints for the minute hand
        // Extend the minute hand beyond the center
        var begin = -30,
            end = 72;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Style the minute hand
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineCap = "round";

        // Rotate based on the current fractions of time
        ctx.rotate((Math.PI/30)*alarm.getMinutes() + (Math.PI/1800)*alarm.getSeconds())
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end , 0);
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paint the alarm "phantom" second hand.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     */
    function drawAlarmSecondHand() {
        // Drawing constraints for the second hand
        // Extend the second hand beyond the center
        var begin = -28,
            end = 63;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Styling for most of the parts of the second hand
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(212,0,0,0.1)";
        ctx.lineCap = "round";

        // Every sixty seconds is one revolution
        ctx.rotate(alarm.getSeconds() * Math.PI/30);
        // Only stem of the second hand for alarm
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paints the hour marks on the analog clock face.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawHourMarks() {
        // Drawing constraints for hour marks
        var begin = 68,
            end = 79;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Design of the hour marks
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        // Draw each tick of the twelve hour analog clock
        for (i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI/6);
            ctx.moveTo(begin, 0);
            ctx.lineTo(end, 0);
            ctx.stroke();
        }

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paints the minute tic marks on the clock face.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawMinuteMarks() {
        // Drawing contraints for minute marks
        var begin = 77,
            end = 80;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Design the minute marks
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        for (i = 0; i < 60; i++) {
            // Don't overwrite the hour marks
            if (i%5 != 0) {
                ctx.beginPath();
                ctx.moveTo(begin, 0);
                ctx.lineTo(end, 0);
                ctx.stroke();
            }
            ctx.rotate(Math.PI/30);
        }

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paints the hour hand in the clock display.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawHourHand() {
        // Drawing constraints for the hour hand
        // Extend the hour hand beyond the center
        var begin = -22,
            end = 55,
            // Analog hour
            ahr = now.ahours(),
            min = now.minutes(),
            sec = now.seconds();

        // Don't touch any previous settings on the stack
        ctx.save();

        // Style the hour Hand
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        // Rotate based on the current fractions of time
        ctx.rotate(ahr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec);
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paints the minute hand on the clock display.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawMinuteHand() {
        // Drawing constraints for the minute hand
        // Extend the minute hand beyond the center
        var begin = -30,
            end = 72,
            min = now.minutes(),
            sec = now.seconds();

        // Don't touch any previous settings on the stack
        ctx.save();

        // Style the minute hand
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        // Rotate based on the current fractions of time
        ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec)
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end , 0);
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Paints the analog second hand on the clock.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawSecondHand() {
        // Drawing constraints for the second hand
        // Extend the second hand beyond the center
        var begin = -28,
            end = 63,
            wheelRadius = 10,
            sec = now.seconds();

        // Don't touch any previous settings on the stack
        ctx.save();

        // Styling for most of the parts of the second hand
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#D40000";
        ctx.fillStyle = "#D40000";
        ctx.lineCap = "round";

        // Every sixty seconds is one revolution
        ctx.rotate(sec * Math.PI/30);
        // Stem of the second hand
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();
        // Central "wheel" of the second hand
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        // Bulb of the second hand
        ctx.beginPath();
        ctx.arc(end, 0, wheelRadius, 0 , Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();

        // Hole in the central "wheel" of the second hand
        // Requires a style change so do this last
        ctx.beginPath();
        ctx.fillStyle = "#000"
        ctx.arc(0, 0, wheelRadius/2, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }

    /**
     * Draws the background of the clock.
     * Required by the drawClock function.
     * Scaled to a 200px diameter clock rotated to origin of 12o'clock.
     * @private
     */
    function drawClockFace() {
        // Drawing constraints for the clock face
        var faceRadius = 89;

        // Don't touch any previous settings on the stack
        ctx.save();

        // Styling for the clock face
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';

        // Draw the clock face
        ctx.beginPath();
        ctx.arc(0, 0, faceRadius, 0, Math. PI*2, true);
        ctx.closePath();
        ctx.stroke();

        // Restore previous settings on the canvas stack
        ctx.restore();
    }



    //-------------------------------------------------------------- Public API
    /**
     * Begin running the clock whether or not an alarm has been set. Clock
     * runs in the forward direction.
     */
    self.start = function() {
        timer.start();
    };

    /**
     * Stop the clock running. This leaves the view of the clock on the
     * screen.
     */
    self.stop = function() {
        timer.stop();
    };

    /**
     * Sets an alarm with this clock.
     * @param a {Date} Date object when the alarm should occur.
     */
    self.setAlarm = function(a) {
        alarm = a;
    };

    /**
     * Adds an alarm event. Alarm events will be handed the date object of
     * the alarm as the first argument when the event function is called.
     * As a convenience this function can take different parameters.
     * @param {function or object} eventObj required If the parameter is a
     * function, the function will be added to the queue and will be added to
     * the queue to be called.  If the argument is anything other than a
     * function, a toString() method will be attached to it and the function
     * will (right now) plug and pray.
     */
    self.addAlarmEvent = function(eventObj) {
        if (typeof(eventObj) == "function") {
            alarmEvents.push(eventObj);
        }
        else {
            alarmEvents.push(eventObj.toString());
        }
    };

    /**
     * Remove anything created by the instance of the Clock class.
     */
    self.destroy = function() {
        // Stop any events that might still be running
        self.stop();
        alarm = null;
        // Remove references to all elements and dstroy elements that we've
        // created
        ctx = null;
        clockDiv.removeChild(clockCanvas);
        clockCanvas = null;
        clockDiv = null;
        // remove internal reference
        self = null;
    };

    /**
     * Turn a clock into a representative string that can be stored.
     * Works on these assumptions:
     * We don't care about the current time of the clock.
     * We do care whether an alarm is set.
     * We care if there are string events associated with the alarm.
     * We have a problem that characters in the string will cause havok if
     * try to make a delimiter so we simply allow the first non function
     * string, if any, to be concatenated to the alarm time in milliseconds.
     * @returns {string} "alarm.getTime() whatever Message is stored if any" or
     * "alarmInMs" or null if there is no alarm set.
     */
    self.toString = function() {
        var alarmInMs = null,
            alarmMessage,
            i;

        if (alarm && alarm.getTime) {
            alarmInMs = alarm.getTime();
        }
        for (i = 0; i < alarmEvents.length; i++) {
            if (alarmEvents[i] && typeof(alarmEvents[i]) != "function") {
                alarmMessage = alarmEvents[i];
                // Take one and only one string
                break;
            }
        }
        if (alarmInMs && alarmMessage) {
            return alarmInMs + " " + alarmMessage;
        }
        else if (alarmInMs && !alarmMessage) {
            // no message to return
            return alarmInMs;
        }
        else {
            // no alarm to return and we don't want to just return a message
            // if one doesn't exist
            return null;
        }
    };

    //------------------------------------------------ Return constructed object
    /*
     * Perform any construction and initialization before passing back the
     * object.
     */
    (function() {
        clockCanvas = document.createElement("canvas");
        clockCanvas.width = diameter;
        clockCanvas.height = diameter;
        clockDiv.appendChild(clockCanvas);
        /**
         * Reference to the canvas context on where the clock will be drawn.
         */
        ctx = clockCanvas.getContext('2d');

        // Listen to the timer tick event.
        timer.subscribe("tick", updateTime);
    })();
    return self;
};
