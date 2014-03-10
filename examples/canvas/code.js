window.onload = function() {

    // Canvas element for sizing.
    var canvas = document.getElementById('canvas');
    // Context provides drawing api.
    var context = canvas.getContext('2d');

    // Coordinates of shapes to be drawn.
    // This is not the canvas API.
    var shapes = {
        "mouse": null,
        "drawing": null,
        "drawn": []
    };



    // Different shapes we draw. Canvas has only abstract shapes.
    // This demonstrates a portion of the canvas API.
    var drawShape = {
        cross: function(shape) {
            var x = shape.x;
            var y = shape.y;
            var r = shape.radius;

            context.strokeStyle = "rgba(100, 100, 100, 0.8)";
            context.fillStyle = "rgba(100, 100, 100, 0.2)";

            context.beginPath();
            context.moveTo(x, y-r);
            context.lineTo(x, y+r);

            context.moveTo(x-r, y);
            context.lineTo(x+r, y);
            context.stroke();
        },
        circle: function(shape) {
            context.strokeStyle = "rgba(100, 100, 100, 0.8)";
            context.fillStyle = "rgba(100, 100, 100, 0.2)";

            context.beginPath();
            context.arc(shape.x, shape.y, shape.radius, 0, Math.PI*2, true);
            context.stroke();
            context.fill();
        },
        rectangle: function(shape) {
            context.strokeStyle = "rgba(100, 100, 100, 0.8)";
            context.fillStyle = "rgba(100, 100, 100, 0.2)";

            context.fillRect(shape.x, shape.y, shape.width, shape.height);
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        },
        line: function(shape) {
            context.strokeStyle = "rgba(100, 100, 100, 1.0)";

            context.beginPath();
            context.moveTo(shape.x, shape.y);
            context.lineTo(shape.x2, shape.y2);
            context.stroke();
        }
    };



    // Canvas needs to be sized via HTML attributes.
    (function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.onresize = arguments.callee;
    })();



    // Shapes are drawn via mousedown-drag-mouseup.
    // This is not the canvas API.
    (function() {

        var shape = false;
        var initX, initY;
        var shapeDrawing = function() {
            return document.querySelector("#controls").getAttribute("data-shape-drawing");
        };
        var distance = function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        };

        document.body.addEventListener("mousedown", function(e) {
            var s = shapeDrawing();
            if (e.target.nodeName == "CANVAS" && s) {
                initX = e.pageX;
                initY = e.pageY;
                shape = s;
            }
        });

        document.body.addEventListener("mousemove", function(e) {
            if (shape) {
                if (shape == "circle") {
                    shapes.drawing = {
                        "type": shape,
                        "radius": distance(initX, initY, e.pageX, e.pageY)/2,
                        "x": initX + (e.pageX-initX)/2,
                        "y": initY + (e.pageY-initY)/2
                    };
                }
                else if (shape == "rectangle") {
                    shapes.drawing = {
                        "type": shape,
                        "x": initX,
                        "y": initY,
                        "width": e.pageX-initX,
                        "height": e.pageY-initY
                    };
                }
                else if (shape == "line") {
                    shapes.drawing = {
                        "type": shape,
                        "x": initX,
                        "y": initY,
                        "x2": e.pageX,
                        "y2": e.pageY
                    };
                }
            }
        });

        document.body.addEventListener("mouseup", function(e) {
            if (shape) {
                shape = null;
                if (shapes.drawing) {
                    shapes.drawn.push(shapes.drawing);
                    shapes.drawing = null;
                }
            }
        });
    })();



    // Track the mouse.
    // This is not the canvas API.
    (function() {
        document.body.addEventListener("mousemove", function(e) {
            shapes.mouse = {
                "type": "cross",
                "radius": 25,
                "x": e.pageX,
                "y": e.pageY
            };
        });
        document.body.addEventListener("mouseout", function(e) {
            shapes.mouse = null;
        });
    })();



    // Draw according to button clicked.
    // This is not the canvas API.
    (function() {
        var buttons = document.querySelectorAll("#controls button");
        var i;
        for (i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function(e) {
                this.parentNode.setAttribute("data-shape-drawing",
                    this.id);
                document.querySelector("#shape-drawing").innerHTML = this.id;
            });
        }
    })();



    // Throttle the drawing.
    setInterval(function() {
        var i;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (shapes.drawn.length) {
            for (i = 0; i < shapes.drawn.length; i++) {
                drawShape[shapes.drawn[i].type](shapes.drawn[i]);
            }
        }

        if (shapes.drawing) {
            drawShape[shapes.drawing.type](shapes.drawing);
        }

        if (shapes.mouse) {
            drawShape[shapes.mouse.type](shapes.mouse);
        }
    }, 50);

};
