window.onload = function() {
    var moon = document.getElementById("moon"),
        dot = document.getElementById("right");

    moon.style.left = moon.offsetLeft + 1 + "px";

    if (moon.offsetLeft <= dot.offsetLeft) {
        // Repeat until we're behind the moon.
        setTimeout(arguments.callee, 10);
    }
};
