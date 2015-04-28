window.onload = function() {

    var body = document.body,
        toBeRotated = document.querySelector("#to-be-rotated");
    var rotation = 0,
        deltaRotation = 0;

    body.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    }, false);

    body.addEventListener('gesturechange', function(e) {
        deltaRotation = rotation + e.rotation;
        toBeRotated.style.webkitTransform = "rotate("+deltaRotation+"deg)";
    }, false);

    body.addEventListener('gestureend', function(e) {
        rotation = deltaRotation;
    }, false);
};
