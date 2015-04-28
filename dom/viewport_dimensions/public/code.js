window.onload = function() {
    var $ = function(selector) {
        return document.querySelector(selector);
    };

    $("#screen-width").innerHTML = screen.width;
    $("#screen-height").innerHTML = screen.height;

    $("#layout-width").innerHTML = document.documentElement.clientWidth;
    $("#layout-height").innerHTML = document.documentElement.clientHeight;

    $("#visual-width").innerHTML = window.innerWidth;
    $("#visual-height").innerHTML = window.innerHeight;

    $("#html-width").innerHTML = document.documentElement.offsetWidth;
    $("#html-height").innerHTML = document.documentElement.offsetHeight;

    $("#zoom-scale").innerHTML = window.innerWidth /
        document.documentElement.clientWidth;

    setTimeout(arguments.callee, 500);
};
