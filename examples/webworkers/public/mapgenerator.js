var log = function(message) {
    postMessage({
        log: "(mapgenerator) "+(new Date())+": "+message
    });
};

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

var generateMap = function(width, height) {
    var w, h;
    var map = [];

    for (h = 0; h < height; h++) {
        map[h] = [];
        for (w = 0; w < width; w++) {
            map[h][w] = (Math.random() > 0.40) ? 0 : 1;
        }
    }
    map[0][0] = 0;
    map[height-1][width-1] = 0;
    sendMap(map);
};

onmessage = function(event) {
    log("Starting map generation.");

    if (event.data.width && event.data.height) {
        generateMap(event.data.width, event.data.height);
    }
    else {
        log("Expecting a width and a height property.");
    }
};
