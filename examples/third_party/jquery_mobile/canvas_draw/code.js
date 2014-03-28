$(document).ready(function() {

    var Point = function(e, el) {
        var colorChoices = [
            {"red": 251, "green": 0, "blue": 13},
            {"red": 255, "green": 111, "blue": 0},
            {"red": 201, "green": 0, "blue": 122},
        ];
        var colorIndex = Math.floor(Math.random() * colorChoices.length);

        this.x = e.pageX - el.offset().left;
        this.y = e.pageY - el.offset().top;

        this.radius = 40;

        this.red = colorChoices[colorIndex].red;
        this.green = colorChoices[colorIndex].green;
        this.blue = colorChoices[colorIndex].blue;
    };

    var CanvasView = function(selector) {
        var el = $(selector),
            ctx = el[0].getContext('2d'),
            points = [],
            // NEW CODE - a label for our image.
            label = "";

        this.el = el;

        this.resize = function() {
            var userInput = $("#user-input");
            var ww = window.innerWidth;
            var wh = window.innerHeight - userInput.height();
            var w = el.attr("width");
            var h = el.attr("height");

            if((w != ww) || (h != wh)) {
                el.attr("width", ww);
                el.attr("height", wh);
            }

            this.draw();
        };

        var drawPoint = function(p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = "rgba("+p.red+","+p.green+","+p.blue+","+0.2+")";
            ctx.fill();

            ctx.lineWidth = 2.0;
            ctx.strokeStyle = "rgba("+p.red+","+p.green+","+p.blue+","+0.8+")";
            ctx.stroke();
        };

        var drawLabel = function() {
            var height = el.getAttribute("height") - 80;
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#000000";
            ctx.fillText(label, 10, height);
        };

        this.draw = function() {
            this.clear();

            for (var i = 0; i < points.length; i++) {
                drawPoint(points[i]);
            }

            if (label) {
                drawLabel();
            }
        };

        this.clear = function() {
            ctx.clearRect(0, 0,
                el.attr("width"),
                el.attr("height"));
        };

        this.clearPoints = function() {
            points = [];
        };

        this.addPoint = function(e) {
            var p = new Point(e, el);
            points.push(p);
        };

        this.addLabel = function(l) {
            label = l;
        };
        this.clearLabel = function() {
            label = "";
        };
        this.objectify = function() {
            var data = {
                "label": label || "",
                "points": points
            };
            return data;
        };
        this.deobjectify = function(data) {
            points = data.points || [];
            label = data.label || "N/A";
        };
    };

    // Display notifications to the user.
    var NotificationsView = function(selector) {
        var el = $(selector),
            messageQueue = [],
            displayFor = 1000,
            timeoutId;

        var nextMessage = function() {
            // Only reset the timeout id here.
            timeoutId = null;
            el.hide();
            display();
        };

        var display = function() {
            if (messageQueue.length && !timeoutId) {
                el.show();
                el.html(messageQueue.shift());
                timeoutId = setTimeout(nextMessage, displayFor);
            }
        };

        this.add = function(message) {
            messageQueue.push(message);
            display();
        };
    };

    var LocationController = function() {
        var canGeoLocate = (navigator && navigator.geolocation) ? true : false;
        var defaultBadAddress = "No Address";

        // Call find
        this.find = function(callback) {
            if (canGeoLocate) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // TODO: drop in address resolution.
                    },
                    function(err) {
                        console.log("geocoding error, code: " + err.code);
                        // Error, move on for the sake of the example.
                        callback(defaultBadAddress);
                    }
                );
            }
            else {
                // Can't geolocate at all, just move on.
                callback(defaultBadAddress);
            }
        };

    };

    // Handles data saving and data retrieval.
    var GalleryController = function() {
        var data = [];
        var index = 0;
        var baseURL = ""; // TODO:....

        // We expect, by this point, data to be a serialized message.
        this.save = function(callback, data) {
            var url = baseURL + "&save=" + data;
            // TODO: Implement....
            callback([]);
        };

        this.load = function(callback) {
            var url = baseURL + "&get=1";
            // TODO: ....
            callback([]);
        };

        this.length = function() {
            return data.length;
        };

        this.first = function() {
            // Reset our gallery.
            index = 0;
            return data[index];
        };

        this.next = function() {
            if (index < data.length-1) {
                index += 1;
            }
            // We're lazy. This will technically reload the image anytime
            // we click next, but that's fine for our simple example.
            return data[index];
        };

        this.previous = function() {
            if (index > 0) {
                index -= 1;
            }
            // We're lazy. This will technically reload the image anytime
            // we click next, but that's fine for our simple example.
            return data[index];
        };
    };


    // notify = notificationsView
    // canvas = CanvasView
    // loc = LocationController
    // gallery = GalleryController
    var CanvasStateManager = function(notify, canvas, loc, gallery) {
        // Current state. No action is taken until changeState is called.
        var currentState = "";

        this.changeState = function(state) {
            if (currentState != state && this[state+"Enter"]) {
                currentState = state;
                this[state+"Enter"]();
            }
        };

        this.drawEnter = function() {
            var self = this;

            notify.add("Drawing mode.");

            // Clear any previous drawings.
            canvas.clearPoints();
            canvas.clearLabel();
            canvas.clear();

            $("#user-input input")
                .attr("disabled", "disabled")
                .off("click");

            // Setup draw specific events.
            canvas.el.on('click', function(e) {
                // Prevent scrolling of the page during a drag.
                canvas.addPoint(e);
                // Have to draw after each point.
                canvas.draw();
            });

            $("#save").removeAttr("disabled").on('click', function() {
                self.changeState("saveDrawing");
            });

            $("#gallery").removeAttr("disabled").on("click", function() {
                self.changeState("viewGallery");
            });
        };

        this.saveDrawingEnter = function() {
            var self = this;
            var drawingData = canvas.objectify();

            notify.add("Saving...");

            $("#user-input input").off("click").attr("disabled", "disabled");

            loc.find(function(addr) {
                drawingData.label = addr;

                gallery.save(function() {
                    notify.add("Saved. Back to drawing mode.");
                    self.changeState("draw");
                }, JSON.stringify(drawingData));
            });
        };

        this.viewGalleryEnter = function() {
            var self = this;

            notify.add("Loading gallery...");

            // Kill all button interaction until we're loaded
            $("#user-input input")
                .attr("disabled", "disabled")
                .off('click');

            // but we can go ahead and setup event listeners.
            $("#previous-drawing")
                .removeAttr("disabled")
                .on('click', function(e) {
                    var img = gallery.previous();
                    canvas.deobjectify(img);
                    canvas.draw();
                });

            $("#next-drawing")
                .removeAttr("disabled")
                .on('click', function(e) {
                    var img = gallery.next();
                    canvas.deobjectify(img);
                    canvas.draw();
                });

            $("#draw")
                .removeAttr("disabled")
                .on('click', function(e) {
                    self.changeState("draw");
                });

            // See if we have anything to view.
            gallery.load(function() {
                if (gallery.length() > 0) {
                    // Load the first image.
                    var img = gallery.first();
                    canvas.deobjectify(img);
                    canvas.draw();

                    notify.add("Gallery view mode.");
                }
                else {
                    notify.add("Nothing in the gallery, yet. Back to draw mode.");
                    self.changeState("draw");
                }
            });
        };
    };

    //--------------------------------------------------------------------- main
    window.canvas = new CanvasView('#canvas');
    var notificationsView = new NotificationsView("#notifications");
    var locationController = new LocationController();
    var galleryController = new GalleryController();
    var canvasStateManager = new CanvasStateManager(notificationsView,
        canvas, locationController, galleryController);

    // Resize our canvas into the current window real estate.
    canvas.resize();

    // Kick off our application in draw mode.
    canvasStateManager.changeState("draw");

    // Resize the canvas on orientation change.
    window.addEventListener("orientationchange", function() {
        canvas.resize();
    });
    canvas.el.on('touchmove', function(e) {
        // Prevent scrolling of the page during a drag.
        e.preventDefault();
    });

});
