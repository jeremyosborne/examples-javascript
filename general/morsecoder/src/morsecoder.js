// File assumes ECMAScript 5 compliance.
(function(exports) {

    //------------------------------------------------------ Module Utilities
    /*
     * Maps an objects values onto a new object, performing a shallow copy.
     * 
     * @param obj {Object} Object from which to map keys and values to a new
     * object. Assumes input is an associative array (Object) and not an 
     * Array.
     * @return {Object} A new object acting as a shallow copy clone of 
     * original.
     */    
    var shallowCopy = function(obj) {
        var out = {};
        var i;
        
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                out[i] = obj[i];
            }
        }
        
        return out;        
    };
    /*
     * Transposes an object's own properties, and value references, to a new 
     * object.
     * 
     * @param obj {Object} The object with which keys and values will be
     * transposed in the output. Assumes input is an associative array 
     * (Object) and not an Array.
     * @param [strict=false] {Boolean} If truthy, will throw an error if
     * object values do not map uniquely back to keys.
     * @return {Object} A new object with the keys and values inversed from
     * the original. Some object will always be created, even if obj passed
     * in is non-intelligent. Remember all keys will be of type String in
     * the output, because that's the way JavaScript rolls.
     */
    var transpose = function(obj, strict) {
        var out = {};
        var i;
        
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (strict && out.hasOwnProperty(i)) {
                    throw new Error("Tansposing non-distinct key:value pair :" + i);
                }
                out[obj[i]] = i;
            }
        }
        
        return out;
    };
    /*
     * Resets the value of any property of o1 to the value of o2, or sticks 
     * to the original value of o1 if the value does not exist on o2. Does 
     * not map new values from o1 to o2.
     * @param o1 {Object} The original object.
     * @param o2 {Object} The object containing reset values for the original.
     * @return {Object} A reference to o1, although since the change is in
     * place, the return value can be ignored.
     */
    var revalue = function(o1, o2) {
        var i;
        
        for (i in o1) {
            if (o1.hasOwnProperty(i) && o2.hasOwnProperty(i)) {
                o1[i] = o2[i];
            }
        }
        return o1;
    };


    //---------------------------------------------------- MorseCoder code.
    // Default encodings.
    var DEFAULT_MORSE_ENCODINGS = {
        ".": ".",
        "-": "-",
        " ": " ",
    };
    Object.seal(DEFAULT_MORSE_ENCODINGS);

    // Default gaps.
    var DEFAULT_MORSE_GAPS = {
        // If overriding the gaps visually, it is recommended to add spaces
        // surrounding the words-as-gaps for easier recognition by the human
        // eye.
        //
        // Three units.
        "letter": "   ",
        // 7 units.
        "word": "       ",
    };
    Object.seal(DEFAULT_MORSE_GAPS);
    

    // ITU morsecode table of all characters we are willing to translate.
    var DEFAULT_MORSE_CODE_ALPHABET = {
        "a": ". -",
        "b": "- . . .",
        "c": "- . - .",
        "d": "- . .",
        "e": ".",
        "f": ". . - .",
        "g": "- - .",
        "h": ". . . .",
        "i": ". .",
        "j": ". - - -",
        "k": "- . -",
        "l": ". - . .",
        "m": "- -",
        "n": "- .",
        "o": "- - -",
        "p": ". - - .",
        "q": "- - . -",
        "r": ". - .",
        "s": ". . .",
        "t": "-",
        "u": ". . -",
        "v": ". . . -",
        "w": ". - -",
        "x": "- . . -",
        "y": "- . - -",
        "z": "- - . .",
    };
    Object.seal(DEFAULT_MORSE_CODE_ALPHABET);

    /**
     * Takes the provided "alphabet" of properties and, treating each value
     * as a string, recodes each individual symbol of the alphabet heiroglyphs.
     * @param alphabet {Object} The alphabet to rencode.
     * @param symbolMap {Object} What to map the individual characters to.
     * If the individual characters are not found in the symbolMap, they will
     * be dropped through.
     * @return {Object} The alphabet is returned, although as this is an
     * in place change catching the return value is not entirely necessary.
     */
    var _encodeAlphabet = function(alphabet, symbolMap) {
        var letter,
            alphabetGlyph,
            recodedGlyph,
            i;
            
        for (letter in alphabet) {
            if (alphabet.hasOwnProperty(letter)) {
                // Each glyph is assumed to be a string of symbols.
                alphabetGlyph = alphabet[letter].split("");
                recodedGlyph = [];
                for (i = 0; i < alphabetGlyph.length; i++) {
                    recodedGlyph[i] = symbolMap[alphabetGlyph[i]] || alphabetGlyph[i];
                }
                // All symbols and glyphs are lower case. Correct here if
                // necessary. Case is set during the encoding process,
                // and case is not inherent to aural morse code.
                alphabet[letter] = recodedGlyph.join("").toLowerCase();
            }
        }
        
        return alphabet;
    };

    /**
     * Encode a message into Morse Code.
     * @param encodeFrom {string} To be translated into morse code.
     * @returns {string} A translation of the text.
     * @methodOf MorseCoder.prototype
     */    
    var encode = function(encodeFrom) {
        // Array of strings, will be concated together for the output.
        var out = [];
        // Test to see if a letter is what we consider upper case.
        var isUpper = /[A-Z]/;
        // Reference to the encodings.
        var alphabet = this.alphabet;
        var gaps = this._gaps;
        // Used to remove trailing gaps.
        var gapRemover = new RegExp("("+gaps.letter+"|"+gaps.word+")*$");
        // List of all space separated words.
        var words = encodeFrom.split(/\s/);
        // Loop counters and variables.
        var word,
            letter,
            lowerCaseLetter,
            encodedLetter,
            i,
            j;
                    
        // Iterate the entire string.
        for (i = 0; i < words.length; i++) {
            // Iterate over each word.
            word = words[i];
            // Only letters that can be mapped will be translated, if they can't
            // they get dropped through.
            for (j = 0; j < word.length; j++) {
                letter = word[j];
                // All encoding keys will be in lower case.
                lowerCaseLetter = letter.toLowerCase();
                if (lowerCaseLetter in alphabet) {
                    // Known letters/symbols are encoded.
                    encodedLetter = alphabet[lowerCaseLetter];
                    // Note: Traditional encoding does not allow for upper
                    // or lower case, but letter based encodings will.
                    if (isUpper.test(letter)) {
                        // We distinguish upper and lower case letters by
                        // upper casing the visual output, something we can
                        // do visually that is not possible aurally.
                        encodedLetter = encodedLetter.toUpperCase();
                    }
                    out.push(encodedLetter);
                }
                else {
                    // For unknown letters, we pass them through.
                    out.push(letter);
                }
                
                // Are we at the end of the word?
                if (j != word.length-1) {
                    // no we are not.
                    out.push(gaps.letter);
                }
                else {
                    // yes we are.
                    out.push(gaps.word);
                }
            }
        }
        // Remove the trailing "gaps" that might appear.
        return out.join("").replace(gapRemover, "");
    };
    
    /**
     * Encode a message from Morse Code.
     * @param decodeFrom {string} To be translated from Morse Code.
     * @returns {string} A decoding of the text.
     * @methodOf MorseCoder.prototype
     */
    var decode = function(decodeFrom) {
        // Array of strings, will be concated together for the output.
        var out = [];
        // Test to see if a letter is what we consider upper case.
        var isUpper = /[A-Z]/;
        // Reference to the encodings.
        var alphabetDecoder = this.alphabetDecoder;
        var gaps = this._gaps;
        // List of all words determined by the output.
        var words = decodeFrom.split(gaps.word);
        // Loop counters.
        var word,
            letter,
            lowerCaseLetter,
            decodedLetter,
            i,
            j;
        
        for (i = 0; i < words.length; i++) {
            // Word here is an array, not a string.
            word = words[i].split(gaps.letter);
            for (j = 0; j < word.length; j++) {
                // A letter here is not a single character but an encoding.
                letter = word[j];
                lowerCaseLetter = letter.toLowerCase();
                if (lowerCaseLetter in alphabetDecoder) {
                    // Known encodings are decoded.
                    decodedLetter = alphabetDecoder[lowerCaseLetter];
                    // Note: Traditional encoding does not allow for upper
                    // or lower case, but letter based encodings will.
                    if (isUpper.test(letter)) {
                        decodedLetter = decodedLetter.toUpperCase();
                    }
                    out.push(decodedLetter);
                }
                else {
                    // Anything unknown passes right through.
                    out.push(letter);
                }
                
                if (j == word.length-1) {
                    // If we're at the end of the word, insert a space in
                    // our buffer.
                    out.push(" ");
                }
            }
        }
        // Assume all words are already separated by spaces in our paradigm,
        // and that trailing white space is not wanted.
        return out.join("").trim();
    };
    
    /**
     * @class Our Morse code encoder that can be overridden.
     * @param [conf] {Object} Arguments as associative array.
     * @param [conf.encodingOverrides] {Object} An associative array of the
     * individual character overrides used to encode. The three characters
     * recognized here are the dit ".", the dah "-", and the element gap " ".
     * @param [conf.gapOverrides] {Object} An associative array of the
     * gap overrides. The two gaps used are "letter" and "word".
     *
     * @constructor
     * @name MorseCoder
     */
    exports.MorseCoder = function(cnf) {
        var self = {};

        // Normalize.
        cnf = cnf || {};

        // For diagnostic and purposes, we attach the defaults.
        self._DEFAULT_MORSE_ENCODINGS = DEFAULT_MORSE_ENCODINGS;
        self._DEFAULT_MORSE_CODE_ALPHABET = DEFAULT_MORSE_CODE_ALPHABET;
        self._DEFAULT_MORSE_GAPS = DEFAULT_MORSE_GAPS;
        
        // Override the visual decodings of the letters.
        self._encodings = shallowCopy(DEFAULT_MORSE_ENCODINGS);
        if (cnf.encodingOverrides) {
            revalue(self._encodings, cnf.encodingOverrides);
        }
        self._gaps = shallowCopy(DEFAULT_MORSE_GAPS);
        if (cnf.gapOverrides) {
            revalue(self._gaps, cnf.gapOverrides);
        }
        
        // Per instance configurations.
        self.alphabet = _encodeAlphabet( 
            shallowCopy(DEFAULT_MORSE_CODE_ALPHABET),
            self._encodings
        );
        self.alphabetDecoder = transpose(self.alphabet, true);
        
        // Attach our helpers.
        self.encode = encode;
        self.decode = decode;
        // Attach our helpers.
        
        return self;
    };
    
})(this);
