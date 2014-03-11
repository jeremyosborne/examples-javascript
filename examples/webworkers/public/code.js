window.onload = function() {
    var field = document.querySelector("#field");
    var fieldWidth = parseInt(field.width);
    var fieldHeight = parseInt(field.height);

    var context = field.getContext("2d");
    var map = null;
    var path = null;

    var drawMap = function() {
        var w, h;
        var row;
        var width = fieldWidth;
        var height = fieldHeight;

        context.fillStyle = "#000000";

        for (h = 0; h < height; h++) {
            row = map[h];
            for (w = 0; w < width; w++) {
                if (row[w]) {
                    context.fillRect(w, h, 1, 1);
                }
            }
        }
    };

    var drawPath = function() {
        var i;
        var cell;

        context.fillStyle = "#ff0000";

        if (!path.length) {
            alert("Sorry, could not find a path. Please reload the page (the way the code is written, a valid path is not guaranteed).");
        }

        for (i = 0; i < path.length; i++) {
            cell = path[i];
            context.fillRect(cell.x, cell.y, 1, 1);
        }
    };

    var draw = function() {
        drawMap();
        drawPath();
    };

    //------------------------------------------ Implement workers.

    var pathGenerator = new Worker('pathgenerator.js');
    pathGenerator.onmessage = function (e) {
        if (e.data.log) {
            console.log(e.data.logMessage);
        }
        else {
            path = e.data;

            draw();
        }
    };

    var mapGenerator = new Worker('mapgenerator.js');
    mapGenerator.onmessage = function(e) {
        if (e.data.log) {
            console.log(e.data.logMessage);
        }
        else {
            map = e.data;

            pathGenerator.postMessage({
                map: map
            });
        }
    };
    mapGenerator.postMessage({
        width: fieldWidth,
        height: fieldHeight
    });
};
