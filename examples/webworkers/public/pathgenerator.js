var log = function(message) {
    postMessage({
        log: "(pathGenerator) "+(new Date())+": "+message
    });
};

var generatePath = function(map) {
    importScripts("a_star.js");

    var pather = new AStar(map);
    var path = pather.find_path([0, 0], [map[0].length-1, map.length-1]);

    postMessage({path: path});
    log("Path generation done.");
};

onmessage = function(event) {
    log("Starting path computation.");

    if (event.data.map) {
        generatePath(event.data.map);
    }
    else {
        log("Expecting a map property");
    }
};
