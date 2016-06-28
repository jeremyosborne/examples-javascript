// Ticks for animation.
module.exports.start = function(store) {
    var frameDelay = 20;
    var prevTime = Date.now();
    var tick = 0;

    setInterval(function() {
        var currentTime = Date.now();
        tick++;

        store.dispatch({
            type: "TICK",
            delta: currentTime - prevTime,
        });

        if (tick % 20) {
            store.dispatch({
                type: "ENTITY_BOUNDS_KILL",
                x: window.innerWidth,
                y: window.innerHeight,
            });
        }

        prevTime = currentTime;

    }, frameDelay);
};
