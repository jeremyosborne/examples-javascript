window.Clock = function(clockDiv, diam) {
    var self = {},
        defaultDiameter = 200,
        diameter = diam || defaultDiameter,
        radius = diameter / 2,
        clockCanvas,
        ctx,
        now,
        alarm,
        alarmEvents = [],
        nextTimeoutId;

    (function() {
        clockCanvas = document.createElement("canvas");
        clockCanvas.width = diameter;
        clockCanvas.height = diameter;
        clockDiv.appendChild(clockCanvas);
        ctx = clockCanvas.getContext('2d');
    })();

    function checkAlarm() {
        if (alarm && (alarm.getTime() <= now.getTime())) {
            triggerAlarmEvents();
            // Alarm is not reocurring at the moment.
            alarm = null;
        }
    }

    function triggerAlarmEvents() {
        var i,
            triggerThis;

        for (i = 0; i < alarmEvents.length; i++) {
            triggerThis = alarmEvents[i];
            if (typeof(triggerThis) == "function") {
                triggerThis(alarm);
            }
            else {
                alert(triggerThis);
            }
        }
        alarmEvents = [];
    }

    function updateTime() {
        now = new Date();
    }

    function drawClock() {
        var scaleFactor = diameter/defaultDiameter;

        ctx.save();

        ctx.clearRect(0, 0, diameter , diameter);

        ctx.translate(radius, radius);

        ctx.scale(scaleFactor, scaleFactor);

        ctx.rotate(-Math.PI/2);

        if (alarm) {
            drawAlarmHourHand();
            drawAlarmMinuteHand();
            drawAlarmSecondHand();
        }

        drawHourMarks();
        drawMinuteMarks();
        drawHourHand();
        drawMinuteHand();
        drawSecondHand();
        drawClockFace();

        ctx.restore();
    }

    function drawAlarmHourHand() {
        var alarmHours = alarm.getHours(),
            alarmAhr = alarmHours>=12 ? alarmHours-12 : alarmHours;

        ctx.save();

        var begin = -22;
        var end = 55;
        ctx.lineWidth = 7;
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineCap = "round";

        ctx.rotate(alarmAhr*(Math.PI/6) + (Math.PI/360)*alarm.getMinutes() + (Math.PI/21600)*alarm.getSeconds());
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        ctx.restore();
    }

    function drawAlarmMinuteHand() {
        var begin = -30,
            end = 72;

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineCap = "round";

        ctx.rotate((Math.PI/30)*alarm.getMinutes() + (Math.PI/1800)*alarm.getSeconds())
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end , 0);
        ctx.stroke();

        ctx.restore();
    }

    function drawAlarmSecondHand() {
        var begin = -28,
            end = 63;

        ctx.save();

        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(212,0,0,0.1)";
        ctx.lineCap = "round";

        ctx.rotate(alarm.getSeconds() * Math.PI/30);
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        ctx.restore();
    }

    function drawHourMarks() {
        var begin = 68,
            end = 79;

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        for (i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI/6);
            ctx.moveTo(begin, 0);
            ctx.lineTo(end, 0);
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawMinuteMarks() {
        var begin = 77,
            end = 80;

        ctx.save();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        for (i = 0; i < 60; i++) {
            if (i%5 != 0) {
                ctx.beginPath();
                ctx.moveTo(begin, 0);
                ctx.lineTo(end, 0);
                ctx.stroke();
            }
            ctx.rotate(Math.PI/30);
        }

        ctx.restore();
    }

    function drawHourHand() {
        var begin = -22,
            end = 55,
            ahr = now.getHours() >= 12 ? now.getHours()-12 : now.getHours(),
            min = now.getMinutes(),
            sec = now.getSeconds();

        ctx.save();

        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        ctx.rotate(ahr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec);
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();

        ctx.restore();
    }

    function drawMinuteHand() {
        var begin = -30,
            end = 72,
            min = now.getMinutes(),
            sec = now.getSeconds();

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec)
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end , 0);
        ctx.stroke();

        ctx.restore();
    }

    function drawSecondHand() {
        var begin = -28,
            end = 63,
            wheelRadius = 10,
            sec = now.getSeconds();

        ctx.save();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#D40000";
        ctx.fillStyle = "#D40000";
        ctx.lineCap = "round";

        ctx.rotate(sec * Math.PI/30);
        ctx.beginPath();
        ctx.moveTo(begin, 0);
        ctx.lineTo(end, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(end, 0, wheelRadius, 0 , Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "#000"
        ctx.arc(0, 0, wheelRadius/2, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawClockFace() {
        var faceRadius = 89;

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';

        ctx.beginPath();
        ctx.arc(0, 0, faceRadius, 0, Math. PI*2, true);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }



    self.start = function() {
        nextTimeoutId = setTimeout(self.start, 1000);

        updateTime();
        drawClock();
        checkAlarm();
    };

    self.stop = function() {
        clearTimeout(nextTimeoutId);
    };

    self.setAlarm = function(a) {
        alarm = a;
    };

    self.addAlarmEvent = function(eventObj) {
        if (typeof(eventObj) == "function") {
            alarmEvents.push(eventObj);
        }
        else {
            alarmEvents.push(eventObj.toString());
        }
    };

    self.destroy = function() {
        self.stop();
        alarm = null;
        ctx = null;
        clockDiv.removeChild(clockCanvas);
        clockCanvas = null;
        clockDiv = null;
        self = null;
    };

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
                break;
            }
        }
        if (alarmInMs && alarmMessage) {
            return alarmInMs + " " + alarmMessage;
        }
        else if (alarmInMs && !alarmMessage) {
            return alarmInMs;
        }
        else {
            return null;
        }
    };

    return self;
};
