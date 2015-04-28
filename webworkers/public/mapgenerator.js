// Worker designed to generate a map of passable/unpassable terrain.

// Send log messages back by message.
var log = function(message) {
    postMessage({
        log: "(mapgenerator) "+(new Date())+": "+message
    });
};

// When the map is done being generated, pass it back in chunks of rows.
var sendMap = function(map) {
    var delay = 50;
    var numRowsPerBatch = 50;
    var sendMapRows = function() {
        var i, rows = [], row;
        for (i = 0; i < numRowsPerBatch; i++) {
            var row = map.shift();
            if (row) {
                rows.push(row);
            }
            else {
                break;
            }
        }
        if (rows.length > 0) {
            postMessage({mapRows: rows});
            setTimeout(sendMapRows, delay);
        }
        else {
            postMessage({done: true});
            log("Map generation done.");
        }
    };
    sendMapRows();
};

// Generate a map, favoring passable terrain over unpassable terrain.
var generateMap = function(width, height) {
    var w, h;
    var map = [];

    for (h = 0; h < height; h++) {
        map[h] = [];
        for (w = 0; w < width; w++) {
            map[h][w] = (Math.random() > 0.35) ? 0 : 1;
        }
    }
    // Make the origin (upper left) and destination (lower right) of the
    // map navigable.
    map[0][0] = 0;
    map[height-1][width-1] = 0;
    sendMap(map);
};

// Listen for messages passed to us. This needs to be global to the worker
// (workers have their own global distinct from window).
onmessage = function(event) {
    log("Starting map generation.");

    if (event.data.width && event.data.height) {
        generateMap(event.data.width, event.data.height);
    }
    else {
        log("Expecting a width and a height property.");
    }
};
