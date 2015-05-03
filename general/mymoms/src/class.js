(function(exports) {



var isArray = function(potentialArray) {
    return Object.prototype.toString.call(potentialArray) === '[object Array]';
};



/**
 * Shallow copy properties from object b to object a.
 * @param target {Object} Receives copy.
 * @param mix {Object} Copy from.
 * @return The target object.
 */
var mixin = function(target, mix) {
    var p;
    for (p in mix) {
        if (mix.hasOwnProperty(p)) {
            target[p] = mix[p];
        }
    }
    return target;
};
// export
if (!exports.mixin) {
    exports.mixin = mixin;
}
else {
    throw new Error("mixin already defined.");
}



/**
 * Simple class/datatype factory.
 * 
 * Cleans up the construction of function objects performing the role of
 * a Class in JavaScript, without adding anything beyond what is already
 * supported by ECMAScript 3.
 * @name Class
 * @param [config] {Object} Arguments as associative array.
 * @param [config.init] {Function} The function that will act as the
 * constructor, or a falsey value if we want an empty function object to be
 * created and used.
 * @param [config.parent] {Function} Parent function (class) that we 
 * want to inherit from.
 * @param [config.mixin] {Object|Object[]} A singular object or an array
 * of objects that conform to the mixin paradigm as can be represented in
 * JavaScript. If an array, each object in the array will have its own 
 * properties and values shallow-copied onto he prototype, in the ascending 
 * order declared in the array.
 * If a non-array object, the object will have its own properties and values 
 * shallow-copied onto the prototype.
 * @return {Function} Function object assumed to be usable as a class/type.
 */
var Class = function(config) {
    var i,
        // Our resulting class/datatype function object.
        Klass;

    // Normalize.
    config = config || {};



    // Determine constructor.
    if (typeof config.init == "function") {
        Klass = config.init;
    }
    else if (config.init) {
        // Something that is not a function is not wanted.
        throw new Error("Class Error: Non-functional constructor.");        
    }
    else {
        // We need a function.
        Klass = function() {};
    }



    // Only inherit if we have something appropriate to inherit from.
    if (typeof config.parent == "function") {
        Klass.prototype = new config.parent();
    }
    else if (config.parent){
        throw new Error("Class Error: Can't inherit from a non-function object.");
    }
    
    
    
    if (isArray(config.mixin)) {
        // Shallow copy keys:values over to the constructor prototype
        // from each object in the array.
        for (i = 0; i < config.mixin.length; i++) {
            mixin(Klass.prototype, config.mixin[i]);
        }
    }
    else if (config.mixin) {
        // Shallow copy keys:values over to the constructor prototype from
        // the object.
        mixin(Klass.prototype, config.mixin);
    }
    
    
    
    return Klass;
};

if (!exports.Class) {
    exports.Class = Class;
}
else {
    throw new Error("Class already defined.");
}


    
})(this);
