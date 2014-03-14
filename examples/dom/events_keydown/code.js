window.onload = function() {

    var pix = [
            "images/callisto.jpg",
            "images/europa.jpg",
            "images/io.jpg",
            "images/ganymede.jpg"
        ];

    var CircularArray = function(a) {
        var index = 0;
        var last = a.length - 1;

        this.next = function() {
            index += 1;
            if (index > last) {
                index = 0;
            }
            return a[index];
        };

        this.prev = function() {
            index -= 1;
            if (index < 0) {
                index = last;
            }
            return a[index];
        };
    };

    pix = new CircularArray(pix);

    document.onkeydown = function(e) {
        var slideshow = document.getElementById("slideshow");

        // Throw back to the old days.
        var key = (e) ? e.which : window.event.keyCode;

        if (key == 37) {
            // left
            slideshow.src = pix.prev();
        }
        else if (key == 39) {
            // right
            slideshow.src = pix.next();
        }
    };
};
