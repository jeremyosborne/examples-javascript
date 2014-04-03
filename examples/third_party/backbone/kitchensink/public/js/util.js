var Util = {
    /**
     * Does its best to convert a property name to a label.
     * @param prop {String} The property to convert.
     * @return {String} The property converted as best as possible to a
     * human readable (cross fingers) label.
     */
    propToLabel: function(prop) {
        var i;
        var letter;
        var parseState = "";
        var word = [];
        var phrase = [];
        // Explode our property into a character array.
        var charArray = prop.split("");

        // Helper function to reset our parsing to initial state.
        // Make sure to save any state before calling this.
        var resetParseState = function() {
            parseState = "";
            word = [];
        };


        // Working backwards prevents necessity of lookahead, and the logic
        // is easier for me to keep in my head.
        while (letter = charArray.pop()) {
            // Possible parsing conditions.
            if (word.length == 0) {
                if (/[a-z]/.test(letter)) {
                    // Standard parsing.
                    parseState = "CAMEL";
                }
                else if (/[A-Z]/.test(letter)) {
                    parseState = "UPPERCASE";
                }
                else if (letter == "_") {
                    parseState = "UNDERSCORE";
                }
                else if (/[0-9]/.test(letter)) {
                    parseState = "NUMERIC";
                }
                else {
                    throw new Error("Failed to classify the parseState");
                }
            }

            // Begin or continue with our parsing.
            switch (parseState) {
                case "CAMEL":
                    // Test for abnormal end conditions first.
                    if (!/[a-zA-Z]/.test(letter)) {
                        // Maybe a character or a number, reset.
                        // Make sure the first character of the word is
                        // a title character.
                        word[0] = word[0].toUpperCase();
                        phrase.unshift(word.join(""));
                        // Put back our unused character.
                        charArray.push(letter);
                        resetParseState();
                    }
                    // Test for normal end conditions.
                    else if (letter == letter.toUpperCase() || charArray.length == 0) {
                        // For normal camel case, end condition is the final
                        // char of the property (final == first) or an upper
                        // case character.

                        // Titlerize the character no matter what.
                        word.unshift(letter.toUpperCase());
                        // Save the word.
                        phrase.unshift(word.join(""));
                        resetParseState();
                    }
                    else {
                        // Expected normal sequence, continue regular parsing.
                        word.unshift(letter);
                    }
                    break;
                case "UPPERCASE":
                    // Uppercase sequences are just that: from 1 to n set of
                    // uppercase letters. Any other character will break the
                    // sequence.
                    // Test for normal end conditions.
                    if (!/[A-Z]/.test(letter)) {
                        // Put our unused letter back.
                        charArray.push(letter);
                        // Save the word.
                        phrase.unshift(word.join(""));
                        resetParseState();
                    }
                    else {
                        // Expected normal sequence, continue regular parsing.
                        word.unshift(letter);
                    }
                    break;
                case "NUMERIC":
                    // Numeric Sequences are just that: from 1 to n set of
                    // numbers. Any other character will break the sequence.

                    // Test for normal end conditions.
                    if (!/[0-9]/.test(letter)) {
                        // Put our unused letter back.
                        charArray.push(letter);
                        // Save the word.
                        phrase.unshift(word.join(""));
                        resetParseState();
                    }
                    else {
                        // Expected normal sequence, continue regular parsing.
                        word.unshift(letter);
                    }
                    break;
                case "UNDERSCORE":
                    // I just want to keep the parse logic here, but really
                    // we're just effecting a continue when we hit an
                    // underscore.
                    resetParseState();
                    break;
                default:
                    throw new Error("Ooops, shouldn't get here.");
            }
        }
        // What is our resulting phrase?
        return phrase.join(" ");
    }
};
