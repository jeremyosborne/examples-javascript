window.onload = function() {
    // Where the map will be drawn (canvas) determines how big the map is.
    var field = document.querySelector("#field");
    var context = field.getContext("2d");
    var fieldWidth = parseInt(field.width);
    var fieldHeight = parseInt(field.height);

    // Map model. 2d array, organized map[row][column].
    // Map data is 0 for passible terrain, 1 for unpassable terrain.
    var map = [];

    // Take a number of rows and draw them on the map.
    var drawMap = function(rows) {
        var w, h;
        var row;
        var offsetHeight = map.length;
        context.fillStyle = "#000000";

        for (h = 0; h < rows.length; h++) {
            row = rows[h];
            for (w = 0; w < row.length; w++) {
                // Draw blocking terrain, leave unblocked terrain undrawn.
                if (row[w]) {
                    context.fillRect(w, h+offsetHeight, 1, 1);
                }
            }
        }
    };

    // Draw the cells representing the path through the terrain, if found.
    var drawPath = function(path) {
        var i;
        var cell;

        context.fillStyle = "#ff0000";

        if (!path || path && !path.length) {
            alert("Sorry, could not find a path. Please reload the page. The way the code is written, a valid path is not guaranteed.");
        }

        for (i = 0; i < path.length; i++) {
            cell = path[i];
            context.fillRect(cell.x, cell.y, 1, 1);
        }
    };

    //------------------------------------------ Web Workers.

    // Web workers (e.g. processes) are defined by a separate file.
    // This worker attempts to generate a path through the map for us
    // from the upper left corner to the lower right.
    var pathGenerator = new Worker('pathgenerator.js');
    // Listen for messages that the worker sends.
    pathGenerator.onmessage = function (e) {
        // Messages are on the event object, and data property representing
        // message info sent back.
        if (e.data.log) {
            // Log is arbitrary, not officially part of the worker interface.
            console.log(e.data.log);
        }
        else if (e.data.path) {
            // We received the path data, draw it.
            drawPath(e.data.path);
        }
        else {
            // We got something unexpected.
            console.error("pathGenerator returned erroneous event object:", e);
        }
    };
    // Listen for errors thrown by the worker.
    pathGenerator.onerror = function(e) {
        console.error("pathGenerator error:", e);
    };



    // Generates where the obstacles are located on the map.
    var mapGenerator = new Worker('mapgenerator.js');
    mapGenerator.onmessage = function(e) {
        if (e.data.log) {
            console.log(e.data.log);
        }
        else if (e.data.mapRows) {
            // We get back chunks of map data. Draw the data in parts.
            drawMap(e.data.mapRows);
            map = map.concat(e.data.mapRows);
        }
        else if (e.data.done) {
            // When we're done, tell the path generator to generate a path.
            pathGenerator.postMessage({
                map: map
            });
        }
        else {
            console.error("mapGenerator returned erroneous event object:", e);
        }
    };
    // We communicate with workers by passing messages to them.
    mapGenerator.postMessage({
        width: fieldWidth,
        height: fieldHeight
    });
};
