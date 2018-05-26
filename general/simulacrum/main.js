var Runner = function() {
    // List of callables.
    this.queue = [];
};

Runner.prototype.add = function(f) {
    this.queue.push(f);
};

Runner.prototype.remove = function(f) {
    var i = this.queue.indexOf(f);
    if (i > -1) {
        this.queue.splice(i, 1);
    }
};

// Run one time through the callable sequence.
Runner.prototype.advance = function() {
    this.ticks += 1;
    var data = {
        ticks: this.ticks,
    };
    for (var i = 0; i < this.queue.length; i++) {
        this.queue[i](data);
    }
};

// Are we automatically running or not?
// null if not, a truthy value if we are (technically the interval id).
Runner.prototype.isRunning = null;

// How many total ticks have passed?
Runner.prototype.ticks = 0;

// If we are not running, start running at interval i (default 1000ms).
Runner.prototype.start = function(i) {
    if (!this.isRunning) {
        this.isRunning = setInterval(this.advance.bind(this), i || 1000);
    }
};

Runner.prototype.stop = function() {
    if (this.isRunning) {
        clearInterval(this.isRunning);
        this.isRunning = null;
    }
};



var intro = function(runner) {
    var introTask = function(data) {
        console.log("running simulacrum");
        // After the intro, remove ourselves from future calls.
        runner.remove(introTask);
    };
    return introTask;
};



var sun = function() {
    var changes = {
        0: "midnight",
        60: "dawn",
        120: "morning",
        180: "midday",
        240: "afternoon",
        300: "dusk",
    };
    return function(data) {
        t = data.ticks % 360;
        if (t in changes) {
            console.log("sun:", changes[t]);
        }
    };
};



var armageddon = function(runner) {
    return function(data) {
        if (data.ticks > 360) {
            runner.stop();
            console.log("Stopping the game. The end.");
        }
    };
};


var runner = new Runner();
runner.add(intro(runner));
runner.add(sun());
runner.add(armageddon(runner));
runner.start(100);
