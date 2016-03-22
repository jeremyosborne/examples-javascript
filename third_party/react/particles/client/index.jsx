require("./app.css");

var React = require("react");
var ReactDOM = require("react-dom");
var store = require("./store");
var World = require("./world");
var heartbeat = require("./heartbeat");

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

var explosion = function(ev) {
    for (var i = 0; i < 9; i++) {
        // x, y, dx, dy
        store.dispatch({
            type: "ENTITY_ADD",
            entity: "particle",
            x: ev.pageX,
            y: ev.pageY,
            dx: (i % 3 - 1) * 5,
            dy: (Math.floor(i / 3 % 3) - 1) * 5,
        });
    }
};

heartbeat.start(store);

var render = function() {
    ReactDOM.render(
        <World entities={store.getState().entities} click={explosion}/>,
        document.getElementById("page")
    );
};
store.subscribe(render);
render();
