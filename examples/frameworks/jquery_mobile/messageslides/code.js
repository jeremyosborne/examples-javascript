$(document).ready(function() {
    var index = 0;
    var translate = function() {
        var li = $("#messages li:first-child");
        if (li.size() > 0) {
            // Signage is flipped for movement vs. index.
            li.css("margin-left", -1*index*100+"%");
        }
    };

    $.ajax({
        url: "http://bro.jeremyosborne.com/api/messagebro",
        data: {
            history: 1,
        },
        dataType: "json",
        success: function(data) {
            var i;
            for (i = 0; i < data.messages.length; i++) {
                $("<li>")
                    .html(data.messages[i].message)
                    .appendTo("#messages");
            }
        },
        error: function() {
            console.error("Error:", arguments);
        }
    });
    $(window).on("swipe", function(e) {
        console.log("swipe");
    });
    $(window).on("tap", function(e) {
        console.log("tap");
    });

    $(window).on("swipeleft", function(e) {
        // next
        index += 1;
        translate();
    });
    $(window).on("swiperight", function(e) {
        // previous
        index -= 1;
        translate();
    });

});
