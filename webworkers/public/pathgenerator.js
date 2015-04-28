// Attempt to find a path through a map.

// Send log messages back by message.
var log = function(message) {
    postMessage({
        log: "(pathGenerator) "+(new Date())+": "+message
    });
};

// Use third party code to find a path from the upper left to lower right
// of map.
var generatePath = function(map) {
    // Web workers can import scripts. This is a blocking request.
    importScripts("a_star.js");

    var pather = new AStar(map);
    var path = pather.find_path([0, 0], [map[0].length-1, map.length-1]);

    postMessage({path: path});
    log("Path generation done.");
};

// Listen for messages passed to us. This needs to be global to the worker
// (workers have their own global distinct from window).
onmessage = function(event) {
    log("Starting path computation.");

    if (event.data.map) {
        generatePath(event.data.map);
    }
    else {
        log("Expecting a map property");
    }
};
