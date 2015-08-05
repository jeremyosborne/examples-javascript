//
// Thin wrapper layer around plain JavaScript objects.
// For when the cost of adding some helpers around plain JavaScript objects
// is worth it for the added help and protection.
//
// Assumed usage:
//
// var simpleModel = require('simplemodel');
// var m = simpleModel(someData, validator);
// // Enjoy your wrapped data.
//
// The validator is extremely basic.
// When .validate(key) is passed, the validation occurs like follows:
// * If key is not present in the optional validator construct passed in,
//   the validation always returns true.
// * If key:val is present in the validation construct, and the val is a primitive,
//   then the validation is true if the key:val in data is also of the same type.
// * If key:val is present in the validation construct, and the val is a function,
//   then the val of key:val in data is passed to the function and  the function
//   must return true or false if the data is valid.
//

// When we need a no-op.
var devNull = function() {};

// Happy friendly value getter from a data object, using dot separated
// strings as keys.
var getter = function(o, key) {
    var k = key.split('.');
    while (o && k.length) {
        o = o[k.shift()];
    }
    return o;
};
// Tests whether an object has a key or not.
// Key must be enumerable.
var hasKey = function(o, key) {
    var ks = key.split('.');
    var has = false;
    while (ks.length) {
        var k = ks.shift();
        if (o) {
            has = o.hasOwnProperty(k);
            o = o[k];
        } else {
            has = false;
        }
    }
    return has;
};



var SimpleModel = function(data, validator) {
    this._data = data;
    this._validator = validator || {};
};
// key {String} multiple level, dot safe string that will return
// the value associated with underlying model data or undefined if the
// data does not exist (doesn't explode like normal dot references).
//
// Example:
//
// model.get("listing.broker.email");
SimpleModel.prototype.get = function(key) {
    return getter(this._data, key);
};
// key {String} multiple level, dot safe string.
// val {mixed} whatever we want to set on the key.
//
// Conservative function that will not create hierarchies that do not
// exist. Will likely throw an error if you are not careful on what you're
// setting (not as nice as the .get() function).
//
// Returns reference to the instance of SimpleModel to allow chaining of
// sets.
//
// Example:
//
// model.set("seller.first_name", "Jane");
SimpleModel.prototype.set = function(key, val) {
    var hierarchy = key.split(".");
    var levels = hierarchy.slice(0, -1);
    var finalKey = hierarchy.slice(-1);
    var o = this._data;
    while (o && levels.length) {
        o = o[levels.shift()];
    }
    o[finalKey] = val;
    // chainable
    return this;
};
// Tries to do a psuedo-intelligent job of clearing a value at a particular
// key.
SimpleModel.prototype.clear = function(key) {
    var val = this.get(key);
    var cleared = null;
    if (typeof val === 'string') {
        // Strings must be strings and not null to be valid.
        cleared = '';
    } else if (typeof val === 'number') {
        // Non falsey values are required for number default behavior.
        cleared = 0;
    } else if (typeof val === 'boolean') {
        cleared = false;
    } else if (Array.isArray(val)) {
        cleared = [];
    } else if (angular.isObject(val)) {
        // Works if we check for arrays first and assume we won't get
        // some silly things like new String() mixed in what should be
        // our JSON data.
        cleared = {};
    }
    this.set(key, cleared);
};
// Validates the value of a specific key in the underlying data.
SimpleModel.prototype.valid = function(key) {
    if (!hasKey(this._validator, key)) {
        // No validator, whatever value is true, even if value doesn't
        // exist in data.
        return true;
    }
    var val = getter(this._data, key);
    var testVal = getter(this._validator, key);
    if (val && typeof val === 'string' && typeof testVal === 'string') {
        // Strings must be strings and not null to be valid.
        return true;
    } else if (val && typeof val === 'number' && typeof testVal === 'number') {
        // Non falsey values are required for number default behavior.
        return true;
    } else if (typeof val === 'boolean' && typeof testVal === 'boolean') {
        return true;
    } else if (typeof testVal === 'function') {
        // It's the job of the testval to accept the value and determine if
        // it is valid or not with a true or false.
        // Functions are called in the context of the simple model instance.
        return testVal.call(this, val);
    } else {
        return false;
    }
};
// Follows ES5 standard to aid in passing these wrapped models to
// JSON.stringify calls.
// Returns a reference to the data for speed. Assumes other function
// calls will be provided for cloning data.
SimpleModel.prototype.toJSON = function() {
    return this._data;
};
// Just a wrapper for angular copy that only returns a clone of the data.
SimpleModel.prototype.cloneData = function() {
    return angular.copy(this._data);
};



module.exports = function(o, v) {
    return new SimpleModel(o, v);
};
