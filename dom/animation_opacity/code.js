window.onload = function() {
    var lyrics = [
        "Ooh ooh",
        "",
        "We're no strangers to love",
        "You know the rules and so do I",
        "A full commitment's what I'm thinking of",
        "You wouldn't get this from any other guy",
        "I just wanna tell you how I'm feeling",
        "Gotta make you understand",
        "",
        "Never gonna give you up",
        "Never gonna let you down",
        "Never gonna run around and desert you",
        "Never gonna make you cry",
        "Never gonna say goodbye",
        "Never gonna tell a lie and hurt you",
        "",
        "We've known each other for so long",
        "Your heart's been aching but",
        "You're too shy to say it",
        "Inside we both know what's been going on",
        "We know the game and we're gonna play it",
        "And if you ask me how I'm feeling",
        "Don't tell me you're too blind to see",
        "",
        "Never gonna give you up",
        "Never gonna let you down",
        "Never gonna run around and desert you",
        "Never gonna make you cry",
        "Never gonna say goodbye",
        "Never gonna tell a lie and hurt you",
    ];

    var fadeIn = function(el, config) {
        var opacity = 0;
        var delta = 1;

        config = config || {};
        el.style.opacity = opacity;

        var id = setInterval(function() {
            opacity += delta;
            el.style.opacity = (opacity / 100);

            if (opacity >= 100) {
                if (typeof config.stop == "function") {
                    config.stop.call(el);
                }
                clearTimeout(id);
            }
        }, 5);
    };

    (function() {
        var runner = arguments.callee;
        var line, el;

        if (lyrics.length) {
            line = lyrics.shift();
            el = document.createElement("div");
            el.className = "lyric";
            el.innerHTML = line || "&nbsp;";
            document.body.appendChild(el);
            fadeIn(el, {
                // Trigger the next frame of the animation.
                "stop": runner
            });
        }
    })();
};
