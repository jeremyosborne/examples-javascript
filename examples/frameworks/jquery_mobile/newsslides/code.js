// Level 1: Get the next and previous working.
// Level 2: Obey the boundaries of the slides.
// Level 3: Use CSS transitions (not jQuery).
// Level 4: Do something cool (like fade in/fade out).
$(document).ready(function() {
    $("img").on("dragstart", function(e) {
        e.preventDefault();
    });

    var index = 0;
    var translate = function() {
        var div = $(".top-story");
        if (div.size() > 0) {
            // Signage is flipped for movement vs. index.
            div.css("margin-left", -1*index*100+"%");
        }
    };

    var topStory = $(".top-story");
    // Hint: margin.
    $(document).on("swipeleft", function(e) {
        console.log("next", e);
        index += 1;
        translate();
    });
    $(document).on("swiperight", function(e) {
        console.log("previous", e);
        index -= 1;
        translate();
    });

    $(document).on('tap', function(e) {
        console.log("tap", e);
    });

});
