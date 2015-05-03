(function(exports) {



    /**
     * @class Collection of string parsing and encoding utilities.
     * @name StringUtil
     * @static
     */
    var StringUtil = exports.StringUtil = {};



    /**
     * Parse a string into an array made up of substrings consisting of 
     * either continuous white space or sub strings of not-whitespace.
     * 
     * This could use a better name.
     * 
     * This is here to remind me that parsers are always unwieldy and silly.
     * 
     * @param toParse {String} The string to parse.
     * @return {String[]} An array of substrings.
     */
    StringUtil.parseIntoChunks = function(toParse) {
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



    /**
     * Assuming that the string being passed in follows general property
     * naming principles used in JavaScript, convert the property name to
     * a (sort of) human readable string that could be used for labeling
     * something like a table header.
     * @param prop {String} The string to attempt to treat like a property.
     * @return {String} The property converted, as best as possible, to a
     * human readable string. 
     */
    StringUtil.propToLabel = function(prop) {
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
                    console.log("entering numer")
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
    };



    /**
     * Converts an object representative of a web form, or web form like object,
     * and converts it to an encoded form acceptable as the content body of an
     * HTTP POST request.
     * See:
     *      http://en.wikipedia.org/wiki/POST_%28HTTP%29
     * @param formObj {object} Object representing the key value pairs of a form.
     * @return {string} The POST encoded "web form".
     */
    StringUtil.encodeWebFormPost = function(formObj) {
    
            // Do we need an ampersand or not
        var pairSeparator  = "",
            // Constants
            AMP = "&",
            SPACE = " ",
            KEYVALSEPARATOR = "=",
            SPACEESCAPE = "+",
            // counter
            i,
            // Return value
            out = "";
    
        //------------------------------------ Util
        // Replace spaces with '+'
        // URL encode everything else
        // @param s {string} The string to encode
        var postEncode = function (s) {
                // split on spaces so we can fill them with pluses later
            var separateWords = s.split(SPACE),
                i;
    
            for (i = 0; i < separateWords.length; i++) {
                // Also encode the exclamation point.
                // Might need to encode all special characters not encoded by
                // encodeURIComponent.
                // Just encoding '!' manually right now.
                // Other potentials: ' * ( )
                separateWords[i] = encodeURIComponent(separateWords[i]).replace("!", "%21");
            }
            // Here we replace the previous pluses with spaces
            return separateWords.join(SPACEESCAPE);
        };
    
        //--------------------------------------------- main
        // For each key value pair
        // '+' replaces all spaces in keys and values
        // All characters are then encodeURIComponent'ed
        // '=' separates keys from values
        // '&' separates key/value pairs
        for (i in formObj) {
            if (formObj.hasOwnProperty(i)) {
                    // The first time this is blank, every other time it will be an amp
                out += pairSeparator
                    // Key
                    + postEncode(i)
                    // Separate
                    + KEYVALSEPARATOR
                    // Value, parse as a string, not as a number
                    + postEncode(""+formObj[i]);
            }
            // All additional key:values separated by ampersand
            pairSeparator = AMP;
        }
        return out;
    
    };



    /**
     * Convert string to MIME base64 encoding.
     * See:
     * http://en.wikipedia.org/wiki/Base64
     * @param s {String} Input string to operate on.
     * @return {String} Base64 encoded string.
     */
    StringUtil.encodeBase64 = function(s) {
            // The 64 characters used in base64 encoding
        var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            // The filler char we'll use
            fillerChar = "=",
            // Convert string to array
            chars = s.split(''),
            // Number of full or partial groups
            num3byteGroups = Math.ceil(chars.length/3),
            // Counters
            i, a, b, c,
            // What will become our output string
            out = "";

        //-------------------------------------------------- Local function
        // Shifts the characters and returns the character code of the number
        var getNextCharCode = function () {
            // chars from outer function
            var character = chars.shift();
            // If the character exists, return the character code,
            // otherwise return the filler character
            return (character) ? character.charCodeAt(0) : fillerChar;
        };

        //-------------------------------------------------- Main code.
        // Figure out how many full shifts of three we have
        for (i = 0; i < num3byteGroups; i++) {
            // The three characters we're working with
            a = getNextCharCode();
            b = getNextCharCode();
            c = getNextCharCode();
            // Working with the 24 bits of the 8-bit characters
            // gives us 4 6-bit characters

            // 1st base64 character:
            // 6 bits come from a
            out += base64chars[(a >> 2)];

            // 2nd base64 character:
            // Bottom two bits of a make up the upper 2 bits of the second char
            // Upper 4 bits of b make up the lower 4 bits of the second char
            // Unless b is the filler char, than b is 0 for the calc
            if (b != fillerChar) {
                out += base64chars[((a & 3) << 4) + (b >> 4)];
            }
            else {
                out += base64chars[((a & 3) << 4)];
            }

            // 3rd base64 character:
            // Bottom 4 bits of b make up the upper 4 bits of the third char
            // Upper 2 bits of c make up the lower 2 bits of the third char
            // Unless b or c are filler chars
            if (b != fillerChar && c != fillerChar) {
                out += base64chars[((b & 15) << 2) + (c >> 6)];
            }
            else if (b != fillerChar && c == fillerChar) {
                out += base64chars[((b & 15) << 2)];
            }
            else {
                // b and c are filler chars
                out += fillerChar;
            }

            // 4th base64 character:
            // Bottom 6 bits of c make up all of the bits of the fourth char
            // unless c is the filler char
            if (c != fillerChar) {
                out += base64chars[(c & 63)];
            }
            else {
                out += fillerChar;
            }
        }

        return out;
    };



    /**
     * Take a UTF-8 character and return a string representing the on/off
     * bits of that character.
     * @param utf8char {String} The character string to be
     * converted to a bit string. If a multi-character string, will take
     * only the first character of the string.
     * @returns {String} the bit string representing the UTF-8 character.
     */
    StringUtil.enocodeBitChar = function(utf8char) {
        var c = utf8char.charCodeAt(0),
            // Bits that will go into our results
            utf8Nibbles = null,
            // Our results
            utf8CharBitString = "",
            // loop counter
            i,
            stringLengthDiff;

        // Converting a unicode character into UTF-8 byte/bit representation
        // Anything 0 to 127 is just that
        // In UTF-8 0xxxxxxx
        if ( c < 128 ) {
            // Convert to binary
            c = c.toString(2);
            // Constrain to 8 bits
            if ( c.length < 8 ) {
                c = "0" + c;
            }
            utf8CharBitString = c;
        }
        else if ( c > 127 && c < 2048 ) {
            // 2 bytes in UTF-8 110xxxx 10xxxxxx
            // We get 2.5 nibbles with the full nibbles falling into
            // the lower bits rearranged to
            // 110cccbb 10bbaaaa
            // where
            // aaaa is the lowest nibble
            // bbbb is the next higher nibble
            // ccc is the remaining half nibble we need to cover all characters in this plane
            // convert to parts
            c = c.toString(2);

            // We have 10 bits that we'll run together then split apart later
            //              c   c   c    b   b   b   b    a   a   a   a
            utf8Nibbles = ["0","0","0", "0","0","0","0", "0","0","0","0"];
            // fill from lower order to upper -> right to left
            stringLengthDiff = utf8Nibbles.length - c.length;
            for ( i = c.length-1; i >= 0; i-- ) {
                utf8Nibbles[i+stringLengthDiff] = c.charAt(i);
            }
            // Final string gets filled from left to right
            utf8CharBitString = "110" + utf8Nibbles.slice(0, 5).join("") + " " + "10" + utf8Nibbles.slice(5).join("");
        }
        else if ( c > 2047 && c < 65536 ) {
            // Three byte UTF-8 characters
            // 1110dddd 10ccccbb 10bbaaaa
            // Here we get 4 nibbles to work with, from lowest (aaaa) to highest (dddd)
            // convert to parts. we're still safe here because JavaScript allocates
            // 16 bits per character
            c = c.toString(2);

            // We have 16 bits that we'll run together then split apart later
            //              d   d   d   d    c   c   c   c    b   b   b   b    a   a   a   a
            utf8Nibbles = ["0","0","0","0", "0","0","0","0", "0","0","0","0", "0","0","0","0"];
            // fill from lower order to upper -> right to left
            stringLengthDiff = utf8Nibbles.length - c.length;
            for ( i = c.length-1; i >= 0; i-- ) {
                utf8Nibbles[i+stringLengthDiff] = c.charAt(i);
            }
            utf8CharBitString = "1110" + utf8Nibbles.slice(0, 4).join("") + " " + "10" + utf8Nibbles.slice(4, 10).join("") + " " + "10" + utf8Nibbles.slice(10).join("");
        }
        else {
            throw new Error("got a 4 byte character. We aren't ready to deal with it here.");
        }

        return utf8CharBitString;
    };



    /**
     * Take a string and convert each character to a string of UTF-8 bits.
     * In UTF-8, each character can potentially be between 1 and 4 bytes.
     * For this to work correctly, make sure the strings you are working with
     * are in UTF-8 encoding.
     * @param s {String} Input string to operate on.
     * @returns {String[]} A single dimensional array. Each element is a string
     * representing the on-ness/off-ness for one particular byte. If a character
     * is made up of more than one byte in UTF-8, the bytes will be space
     * delimited, for example:
     * ü = 2 UTF-8 bytes = "11000011 10011100".
     */
    StringUtil.encodeBitArray = function(s) {
        // our results
        var bitArray = [],
            i;

        for (i = 0; i < s.length; i++) {
            bitArray.push(StringUtil.enocodeBitChar(s.charAt(i)));
        }

        return bitArray;
    };



    /**
     * Remove white space from the beginning and end of a string.
     * @param s {String} Input string to operate on.
     * @return {String} original string without any prefixed or trailing 
     * whitespace.
     */
    StringUtil.trim = function (s) {
        return s.replace(/^\s+|\s+$/g,"");
    };



    /**
     * Remove white space from the end of a string.
     * @param s {String} Input string to operate on.
     * @return {String} Original string without any trailing whitespace.
     */
    StringUtil.rtrim = function(s) {
        return s.replace(/\s+$/g,"");
    };



    /**
     * Remove white space from the beginning of a string.
     * @param s {String} Input string to operate on.
     * @return {String} original string without any prefixed whitespace.
     */
    StringUtil.ltrim = function(s) {
        return s.replace(/^\s+/g,"");
    };



})(this);
