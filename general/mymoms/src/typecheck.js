(function(exports) {



/**
 * Determines if an object is a string.
 * @name isString
 * @param potentialString {object} Object to check for String-ness.
 * @returns {boolean} true if an instance of S/string, false if not.
 */
exports.isString = function(potentialString) {
    if (typeof potentialString === 'string'
        || potentialString instanceof String) {
        return true;
    }
    else {
        return false;
    }
}


/**
 * Determines if an object is a native array type.
 * @name isArray
 * @param potentialArray {object} Object to check for Array-ness.
 * @returns {boolean} true if an instance of Array, false if not.
 */
exports.isArray = function(potentialArray) {
    return Object.prototype.toString.call(potentialArray) === '[object Array]';
}



})(this);
