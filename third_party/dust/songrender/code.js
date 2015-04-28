$(document).ready(function() {
    // Dust is geared much more to server side processing of templates.
    // We are mimicking that process in the client side here.

    // We get the template out of the script tag and then pass it to the dust
    // compiler. The second argument is the name of this template.
    var templateSource = dust.compile($("#song-lyrics-template").html(), "lyrics");

    // dust.compile produces code that is a self executing function of
    // JavaScript. We could simply send this function down to our client
    // code. This is slow, don't do this in real life.
    // In real life, "precompile" your templates somewhere else, like during
    // build time.
    eval(templateSource);

    // Make our own helper that censors every other word.
    songs.censor = function(chunk, context) {
        var words = context.current().split(" ");
        var i;

        for (i = 0; i < words.length; i++) {
            if (i % 2 == 0) {
                words[i] = "CENSORED";
            }
        }

        // Chunk is a stream like object that allows us to write to
        // the current section of the template being interpreted.
        chunk.write(words.join(" "));
    };

    // Once the templates have been registered, we can reference them
    // in the dust render function, pass a context object, and then
    // pass a callback function to handle any errors that arise
    // or to accept the output and then render to the page.
    dust.render("lyrics", songs, function(err, output) {
        $("#songs").html(output);
    });

});
