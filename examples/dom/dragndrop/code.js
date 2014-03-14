window.onload = function() {
    var makeDraggable = function (obj, config) {
        // Our initial offsets for our object
        var deltaX,
            deltaY,
            isDragging = false; // Dragging state

        var startDrag = function(e) {
            if (!e.target === this){
                return;
            }

            // Begin the drag
            isDragging = true;

            if (typeof config.start == "function") {
                // Make the dragging object the "this"
                config.start.call(obj);
            }

            // One trick is that we need to make the element position-able.
            // Here we use absolute positioning, which may not be ideal at all
            // times.
            obj.style.position = "absolute";
            deltaX = e.clientX - obj.offsetLeft;
            deltaY = e.clientY - obj.offsetTop;
        };
        var move = function(e) {
            var x,
                y;

            if ( !isDragging ) {
                return;
            }

            x = e.clientX;
            y = e.clientY;

            obj.style.left = (x - deltaX) + "px";
            obj.style.top = (y - deltaY) + "px";
        };
        var stopDrag = function(e) {
            // Stop dragging of this object
            isDragging = false;

            if (typeof config.stop == "function") {
                // Make the dragging object the "this"
                config.stop.call(obj);
            }
        };

        config = config || {};

        obj.addEventListener("mousedown", startDrag);
        document.body.addEventListener("mouseup", stopDrag);
        document.body.addEventListener("mousemove", move);
    };


    makeDraggable(document.getElementById("drag"), {
        start: function() {
            this.className = "drag";
        },
        stop: function() {
            this.className = "drag";
        }
    });
};
