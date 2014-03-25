YUI().use("node", "event", "event-touch", function(Y) {

    var Point = function(e, el) {
        this.x = e.pageX - el.getX();
        this.y = e.pageY - el.getY();

        this.radius = 40;

        this.red = 0;
        this.green = 0;
        this.blue = 0;
    };

    var CanvasView = function(selector) {
        var el = Y.one(selector),
            ctx = el.getDOMNode().getContext('2d'),
            points = [];

        this.el = el;

        this.resize = function() {
            var ww = window.innerWidth;
            var wh = window.innerHeight;
            var w = el.getAttribute("width");
            var h = el.getAttribute("height");

            if((w != ww) || (h != wh)) {
                el.setAttribute("width", ww);
                el.setAttribute("height", wh);
            }
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

        this.draw = function() {
            this.clear();

            for (var i = 0; i < points.length; i++) {
                drawPoint(points[i]);
            }
        };

        this.clear = function() {
            ctx.clearRect(0, 0, el.getAttribute("width"),
                el.getAttribute("height"));
        };

        this.clearPoints = function() {
            points = [];
        };

        this.addPoint = function(e) {
            var p = new Point(e, el);
            points.push(p);
        };
    };



    var canvas = new CanvasView('#canvas');

    canvas.el.on('touchstart', function(e) {
        e.preventDefault();
    });
    canvas.el.on('touchmove', function(e) {
        var i;

        e.preventDefault();

        canvas.clearPoints();
        for (i = 0; i < e.touches.length; i++) {
            canvas.addPoint(e.touches[i]);
        }
    });
    canvas.el.on('touchend', function(e) {
        canvas.clear();
        canvas.clearPoints();
    });

    canvas.el.on('click', function(e) {
        canvas.addPoint(e);
    });

    setInterval(function() {
        canvas.resize();
        canvas.draw();
    }, 40);

});
