/*global Handlebars:false */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}
