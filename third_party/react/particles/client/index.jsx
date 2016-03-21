require("./app.css");

var React = require("react");
var ReactDOM = require("react-dom");
var store = require("./store");
var World = require("./world");

// TODO: Call on screen size changes.
// var screenSizeAction = {
//     set: function(w, h) {
//         dispatcher.dispatch({
//             type: "SCREEN_SIZE",
//             width: w || window.innerWidth,
//             height: h || window.innerHeight,
//         });
//     },
// };
// // Initialize
// screenSizeAction.set();

// Ticks for animation.
(function() {
    var prevTime = Date.now();

    setInterval(function() {
        var currentTime = Date.now();

        store.dispatch({
            type: "TICK",
            delta: currentTime - prevTime,
        });

        prevTime = currentTime;

    }, 20);
})();

var render = function() {
    ReactDOM.render(
        <World particles={store.getState().particles}/>,
        document.getElementById("page")
    );
};
store.subscribe(render);
render();
