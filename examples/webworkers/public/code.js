window.onload = function() {
    var field = document.querySelector("#field");
    var fieldWidth = parseInt(field.width);
    var fieldHeight = parseInt(field.height);

    var context = field.getContext("2d");
    var map = [];

    var drawMap = function(rows) {
        var w, h;
        var row;
        var offsetHeight = map.length;
        context.fillStyle = "#000000";

        for (h = 0; h < rows.length; h++) {
            row = rows[h];
            for (w = 0; w < row.length; w++) {
                if (row[w]) {
                    context.fillRect(w, h+offsetHeight, 1, 1);
                }
            }
        }
    };

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

    //------------------------------------------ Implement workers.

    var pathGenerator = new Worker('pathgenerator.js');
    pathGenerator.onmessage = function (e) {
        if (e.data.log) {
            console.log(e.data.log);
        }
        else if (e.data.path) {
            drawPath(e.data.path);
        }
        else {
            console.error("pathGenerator returned erroneous event object:", e);
        }
    };

    var mapGenerator = new Worker('mapgenerator.js');
    mapGenerator.onmessage = function(e) {
        if (e.data.log) {
            console.log(e.data.log);
        }
        else if (e.data.mapRows) {
            drawMap(e.data.mapRows);
            map = map.concat(e.data.mapRows);
        }
        else if (e.data.done) {
            pathGenerator.postMessage({
                map: map
            });
        }
        else {
            console.error("mapGenerator returned erroneous event object:", e);
        }
    };
    mapGenerator.postMessage({
        width: fieldWidth,
        height: fieldHeight
    });
};
