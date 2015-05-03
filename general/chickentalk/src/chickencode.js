// File assumes ECMAScript 5 compliance.
$(document).ready(function() {


    // Before anything else, see our Modernizer tests.
    // NOTE: The audio support is a string like "probably" or "maybe".
    // We'll let it slide as long as some string comes back for wav.
    if (!Modernizr.audio.wav || 
        !Modernizr.cssanimations || 
        !Modernizr.csstransforms3d || 
        !Modernizr.multiplebgs || 
        !Modernizr.csstransitions) {
        // Give a warning to people if they have what appears to be a bad browser.
        $(".compatibility-warning").removeClass("hidden");
        // Give the user the option to just ignore our warning.
        $(".compatibility-warning").on("click", function() {
            $(this).hide();
        });
    }



    // An abuse of the Morse Code encoding scheme, turned into insane chicken
    // speak. This will take a human string and turn it into our chicken
    // sounds.
    var chickencoder = new MorseCoder({
        encodingOverrides: {
            ".": "bok",
            "-": "cluck",
            // Leaving out the element gap.
        },
        gapOverrides: {
            "letter": " squak ",
            "word": " cockle ",
        },
    });


    
    // Container for the audio versions of our chicken encoded noises.
    var Noise = function(src) {
        var self = this;
        this.src = src;
        
        this.audio = document.createElement("audio");
        this.audio.addEventListener("ended", function() {
            if (typeof self.done == "function") {
                self.done();
            }
        });
    };
    // Play this particular noise.
    Noise.prototype.play = function() {
        // The currentTime property seems to be read only.
        // This seems to be the only way to play audio repeatedly.
        this.audio.src = this.src;
        this.audio.play();
    };
    // Should something be done when this audio is done?
    Noise.prototype.done = null;



    // The noises (and silence) that are available on our page.
    var noises = {
        "bok": new Noise("audio/dit.wav"),
        "cluck": new Noise("audio/dah.wav"),
        "squak": new Noise("audio/letter.wav"),
        "cockle": new Noise("audio/word.wav"),
        // This implements the Noise interface without me needing to write
        // code to deal with spaces during the readout.
        " ": {
            play: function() {
                var self = this;
                // We assume 25ms was the base duration of all of our Morse
                // Code sounds.
                setTimeout(function() {
                    self.done();
                }, 25);
            },
            // This will be set prior to being called.
            done: null
        }
    };
    // testing
    //window.noises = noises;

    
    
    // A set of visual reactions that lucy will have on each of the different
    // "words" she speaks.
    var chickenReactor = $("#background-lucy-teh-chicken");
    var chickenReactions = function(word) {
        if (chickenReactor.attr("class") || !word) {
            chickenReactor.removeAttr("class");
        }
        else {
            chickenReactor.addClass(word);
        }
    };

    
    /**
     * Parse a string into an array of strings consisting of chunks of 
     * continuous white space and not whitespace.
     * @param toParse {String} The string to parse.
     * @return {String[]} An array of substrings made up of whitespace, and 
     * substrings made up of not-whitespace.
     */
    var parseIntoChunks = function(toParse) {
        var letters = toParse.split("");
        var isWhitespace = /\s/;
        var letter;
        var currentWord;
        var i;        
        var parsed = [];
        
        while (letter = letters.shift()) {
            currentWord = [];
            if (isWhitespace.test(letter)) {
                // Parse any number of empty spaces.
                currentWord.push(letter);
                while (letter = letters.shift()) {
                    // Get any additional white space.
                    if (!isWhitespace.test(letter)) {
                        break;
                    }
                    currentWord.push(letter);
                }
            }
            else {
                // Parse a string of characters.
                currentWord.push(letter);
                while (letter = letters.shift()) {
                    if (isWhitespace.test(letter)) {
                        break;
                    }
                    currentWord.push(letter);
                }
            }
            parsed.push(currentWord.join(""));
            // If we're here, then the last letter, whatever it is, isn't
            // what we want. And, if we do happen to have "undefined" here,
            // we'll still quit out on the next loop.
            letters.unshift(letter);
        }
        
        return parsed;
    };
    // testing
    //window.parseIntoChunks = parseIntoChunks;

    

    // Take the human typed text, convert it to chicken, and paste it
    // into the chicken window. Replacing at intervals seems to work better
    // than detecting key presses, or detecting key presses at intervals.
    var currentUntranslated;
    var updateTranslation = function() {
        var human = $("#human").val();
        if (currentUntranslated != human) {
            // Translate and remember
            currentUntranslated = human;
            $("#chicken").html( chickencoder.encode(human) );
        }
    };
    var translationId = setInterval(function() {
        updateTranslation();
    }, 750);


    
    // Assuming a message that can be "spoken" lives on the page, pressing
    // this button will make Lucy teh Chicken speak the message in her
    // crazy sound chicken language.
    $("#speak").on("click", function() {
        var chickenTalk = $("#chicken").html();
        var speech = parseIntoChunks(chickenTalk);
        
        var speakButton = $(this);
        var stopSpeakingButton = $("#stop-speaking");
        var stopSpeaking = false;
                
        var speak = function() {
            var done = function() {
                // Avoiding arguments.callee... I already miss it.
                speak();
            };
            var sound = speech.shift();
            
            if (typeof sound == "undefined" || stopSpeaking === true) {
                // Allow another spoken translation to occur.
                speakButton.removeAttr("disabled");
                // Remove the ability to cancel when there is nothing to
                // cancel.
                stopSpeakingButton.off("click");
                stopSpeakingButton.attr("disabled", "diasbled");
                // Undo any of Lucy's current speaking states.
                chickenReactions();
                return;
            }
            
            // If we're here, we assume there is something to translate.
            // All sounds are keyed in lower case.
            sound = sound.toLowerCase();
            
            if (sound in noises) {
                // Play the associated noise.
                noises[sound].done = done;
                noises[sound].play();
                // Make the chicken react to the sounds.
                chickenReactions(sound);
            }
            else {
                // Play the "blank" element gap.
                noises[" "].done = done;
                noises[" "].play();
            }
        };
        
        
        // For the love of god, allow the crazy chicken speak to be canceled
        // while it is going. It can go on a long time.
        stopSpeakingButton.removeAttr("disabled");
        stopSpeakingButton.on("click", function() {
            $(this).attr("disabled", "disabled");
            stopSpeaking = true;
        });
        
        
        // Prevent multiple translations from kicking in at once.
        speakButton.attr("disabled", "disabled");
        // Kick it off.
        speak();
    });
});





