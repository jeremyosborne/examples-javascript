(function(exports) {



    /**
     * Perform a shallow comparison of one object against another. Only
     * enumerable properties will be compared.
     * @param o1 {Object} First object to compare.
     * @param o2 {Object} Object against which to compare the first object.
     * @return {Boolean} True if o1 and o2 are shallowly equivalent, false
     * if not.
     */
    exports.compare = function(o1, o2) {
        var i;
        
        for (i in o1) {
            if (o1.hasOwnProperty(i)) {
                if (o1[i] !== o2[i]) {
                    return false;
                }
            }
        }
        // else, it's comparatively the same.
        return true;
    };
    
    

    /**
     * Maps an objects values onto a new object, performing a shallow copy.
     * 
     * @param obj {Object} Object from which to map keys and values to a new
     * object. Assumes input is an associative array (Object) and not an 
     * Array.
     * @return {Object} A new object acting as a shallow copy clone of 
     * original.
     */    
    exports.shallowCopy = function(obj) {
        var out = {};
        var i;
        
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                out[i] = obj[i];
            }
        }
        
        return out;        
    };
    
    
    
    /**
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
    exports.transpose = function(obj, strict) {
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


    
})(this);
