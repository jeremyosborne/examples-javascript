require("./app.css");

var dispatcher = require("./dispatcher");
var React = require("react");
var ReactDOM = require("react-dom");
var World = require("./world");

// Should be called on screen size changes.
var screenSizeAction = {
    set: function(w, h) {
        dispatcher.dispatch({
            type: "SCREEN_SIZE",
            width: w || window.innerWidth,
            height: h || window.innerHeight,
        });
    },
};
// Initialize
screenSizeAction.set();

// Ticks happen for animation.
(function() {
    var prevTime = Date.now();

    setInterval(function() {
        var currentTime = Date.now();

        dispatcher.dispatch({
            type: "TICK",
            delta: currentTime - prevTime,
        });

        prevTime = currentTime;

    }, 20);
})();



ReactDOM.render(
    <World></World>,
    document.getElementById("page")
);
