window.onload = function() {

    // Much of the code is canvas drawing code taken from another
    // example. It is not commented since it is marked up in another example.
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');

    var shapes = {
        "mouse": null,
        "drawing": null,
        "drawn": []
    };

    (function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.onresize = arguments.callee;
    })();

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



    //------------------------------------- Begin File API example.
    (function() {

        // We draw our images on a separate canvas.
        var canvas = document.querySelector('#pictures');
        var context = canvas.getContext('2d');
        var images = [];

        var draw = function() {
            var i;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (i = 0; i < images.length; i++) {
                (function(imageData) {
                    var img = document.createElement("img");
                    img.src = imageData.dataURI;
                    img.onload = function() {
                        context.drawImage(img, imageData.x, imageData.y);
                    };
                })(images[i]);
            }
        };

        // Resize this canvas to the size of the window.
        (function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.left = "0px";
            canvas.style.top = "0px";

            draw();

            window.onresize = arguments.callee;
        })();

        // When a file is dropped, attempt to read the image data out.
        var handleFileSelect = function(e) {
            // From the drag and drop API.
            var f = e.dataTransfer.files[0];
            // Do our own testing against content type.
            var imageRE = /^(image\/bmp|image\/gif|image\/jpeg|image\/png)$/i;
            var fr;
            var x = e.pageX;
            var y = e.pageY;

            // To prevent page transition.
            e.preventDefault();

            if (f) {
                // Ubiquitous data from a file, available on all browsers
                // and OSs that implement this portion of the File API.
                console.log("File name: " + f.name);
                console.log("File type: " + f.type);
                console.log("File size (in bytes): " + f.size);

                if (!imageRE.test(f.type)) {
                    console.log("Not drawing image of type:", f.type);
                    return;
                }

                // File reader is asynchronous.
                fr = new FileReader(f);
                // There are different ways to read a particular file.
                fr.readAsDataURL(f);
                // Once we have the file contents, do something with it.
                fr.onload = function () {
                    images.push({
                        // The file reader provides the contents in the result
                        // property.
                        "dataURI": this.result,
                        "x": x,
                        "y": y
                    });
                    // Not the File API. This triggers a redraw of the images
                    // on the canvas.
                    draw();
                };
            }
        };

        var ignore = function (e) {
            e.preventDefault();
        };

        // Drag and drop events to listen to to get access to the contents
        // of a file dropped into the browser.
        window.addEventListener('dragover', ignore);
        window.addEventListener('drop', handleFileSelect);
    })();
};
