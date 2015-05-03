(function(exports) {



/**
 * Tests to see whether the browser is IE.
 * @returns {boolean} true on IE6, IE7, IE8, seemingly false on everything else.
 */
exports.isIE = function () {
    // Believe it or not, this works.
    return ('\v'=='v');
};


    
})(this);

