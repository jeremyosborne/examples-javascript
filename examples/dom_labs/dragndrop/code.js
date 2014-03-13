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
        // TODO
    };

    var makeDroppable = function(objs, config) {
        // TODO
    };

    var makeDraggable = function(obj, config) {
        // TODO
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
