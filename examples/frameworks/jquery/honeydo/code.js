////////////////////////////////////////////////////////////////////////////////
// Rebuilding a very basic note pad with jQuery.
//
// jQuery is a well known JavaScript library that is used to deal with the
// main pains of JavaScript: Cross-browser compatibility, events, DOM
// manipulation, CSS styling, and also adds sugar methods that probably
// "should have" been part of the DOM, simple ones being .addClass,
// .removeClass, .show, .hide, and more.
//

// This is jQuery's equivalent of an onload event.
$(document).ready(function() {
        // jQuery uses CSS query selectors within its code.
    var notepad = $("#notepad"),
        trash = $("#trash");
    
    $("form").on("submit", function(e) {
        var text = $("#new-note").val(),
            // jQuery is designed to do a lot on one line.
            // Here we create a DOM element, set its contents, add a
            // class to it, and add it to the page.
            note = $("<div>").html(text).addClass("note").prependTo(notepad);

        note.on("click", function() {
            // jQuery objects are (usually) just arrays of DOM objects.
            if ($(this).parent()[0] === notepad[0]) {
                trash.append(this);
            }
            else {
                // and jQuery includes a lot of short cuts.
                $(this).fadeOut(function() {
                    // Remove the element from the page after the fade.
                    // Fade is not a real dom event, but it behaves like one.
                    $(this).remove();
                });
            }
        });

        // In jQuery, since the event is always available, it should be
        // used.
        e.preventDefault();

    });
    
});
