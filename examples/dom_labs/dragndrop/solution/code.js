window.onload = function() {
    var $ = function(s) {
        return document.querySelector(s);
    };
    var makeClassRE = function(className) {
        return new RegExp("(^|\\s)"+className+"(\\s|$)");
    };
    var addClass = function(el, className) {
        var re = makeClassRE(className);

        if (re.test(el.className) == false) {
            if (el.className.length > 0) {
                el.className += " " + className;
            }
            else {
                el.className += className;
            }
        }
    };
    var removeClass = function(el, className) {
        var re = makeClassRE(className);

        el.className = el.className
            .replace(re, " ")
            .replace(/^\s+|\s+$/g,"");
    };
    var contained = function(obj, e) {
        var top = obj.offsetTop;
        var left = obj.offsetLeft;
        var right = left + obj.clientWidth;
        var bottom = top + obj.clientHeight;
        return top <= e.pageY &&
            bottom >= e.pageY &&
            left <= e.pageX &&
            right >= e.pageX;
    };

    var isDragging;
    var dropTargets = [];

    var performDrop = function(dropped, e) {
        var i;
        for (i = 0; i < dropTargets.length; i++) {
            if (contained(dropTargets[i], e)) {
                dropped.style.position = "static";
                dropTargets[i].appendChild(dropped);
            }
        }
    };

    var makeDroppable = function(objs, config) {
        var body = document.body;
        var i;

        var hoverTargets = function(e) {
            var i;
            for (i = 0; i < dropTargets.length; i++) {
                if (contained(dropTargets[i], e) && isDragging) {
                    if (typeof config.hover == "function") {
                        config.hover.call(dropTargets[i]);
                    }
                }
                else {
                    if (typeof config.notHovering == "function") {
                        config.notHovering.call(dropTargets[i]);
                    }
                }
            }
        };

        for (i = 0; i < objs.length; i++) {
            dropTargets.push(objs[i]);
        }
        config = config || {};
        body.addEventListener("mousemove", hoverTargets);
    };


    var makeDraggable = function(obj, config) {
        var deltaX,
            deltaY,
            body = document.body;

        var startDrag = function(e) {
            if (isDragging) {
                return;
            }

            isDragging = obj;

            if (typeof config.start == "function") {
                config.start.call(obj);
            }

            obj.style.position = "absolute";
            deltaX = e.clientX - obj.offsetLeft;
            deltaY = e.clientY - obj.offsetTop;
        };
        var move = function(e) {
            var x,
                y;

            if (isDragging !== obj) {
                return;
            }

            x = e.clientX;
            y = e.clientY;

            obj.style.left = (x - deltaX) + "px";
            obj.style.top = (y - deltaY) + "px";
        };
        var stopDrag = function(e) {
            if (isDragging) {
                performDrop(isDragging, e);

                isDragging = null;

                if (typeof config.stop == "function") {
                    config.stop.call(obj);
                }
            }
        };

        config = config || {};

        obj.addEventListener("mousedown", startDrag);
        body.addEventListener("mouseup", stopDrag);
        body.addEventListener("mousemove", move);
    };

    var drag = document.querySelectorAll(".drag");
    var drop = document.querySelectorAll(".drop");
    var i;

    for (i = 0; i < drag.length; i++) {
        makeDraggable(drag[i], {
            start: function() {
                addClass(this, "dragging");
            },
            stop: function() {
                removeClass(this, "dragging");
            }
        });
    }

    for (i = 0; i < drop.length; i++) {
        makeDroppable(drop, {
            hover: function() {
                addClass(this, "hovering");
            },
            notHovering: function() {
                removeClass(this, "hovering");
            }
        });
    }
};
