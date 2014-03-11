var log = function(message) {
    postMessage({
        log: "mapgenerator"+(new Date())+": "+message
    });
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
    postMessage(map);
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
