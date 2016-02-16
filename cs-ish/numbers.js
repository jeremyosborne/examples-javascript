//
// Allow arbitrarily large integers and basic arithmetic.
//
// Usage:
//
// // CommonJS
// var largeInt = require("numbers").largeInt;
//
// // Construct from any number type, with floats converted to ints.
// var i = LargeInt(1000);
//
// // In place arithmetic.
// i.add(5);
// i.sub(5);
// i.mul(5);
// i.div(5);
//


// TODO: deal with signage.

var LargeInt = function(num) {
    this.data = LargeInt.toDigits(num);
};
// Adds in place.
LargeInt.prototype.add = function(num) {
    this.data = LargeInt.add(this.data, LargeInt.toDigits(num));
    return this;
};
LargeInt.prototype.sub = function(num) {
    this.data = LargeInt.sub(this.data, LargeInt.toDigits(num));
    return this;
};
// Best approximation of the numeric value.
LargeInt.prototype.val = function() {
    return this.data.reduce(function(p, c, i) {
        return p + c * Math.pow(10, i);
    }, 0);
};
// Number of digits.
LargeInt.prototype.size = function() {
    return this.data.length;
};
// As string.
LargeInt.prototype.toString = function() {
    // People read big endian.
    return this.data.reduceRight(function(p, c) {
        return p + c;
    }, "");
};
LargeInt.toDigits = function(num) {
    num = parseInt(num);
    if (Number.isNaN(num)) {
        throw new Error("Must pass a number.");
    }
    var data = [];

    var numstr = num.toString();
    // little endian
    for (var i = 0; i < numstr.length; i++) {
        data.unshift(parseInt(numstr[i]));
    }
    return data;
};
LargeInt.sub = function(lh, rh) {
    var result = [];
    var len = lh.length > rh.length ? lh.length : rh.length;
    var remainder = 0;
    for (var i = 0; i < len; i++) {
        // Remainder should only ever be -1 or 0.
        var u = (lh[i] || 0) - (rh[i] || 0) - remainder;
        remainder = u >= 0 ? 0 : 1;
        result.push(u >= 0 ? u : u + 10);
    }
    // trim zeroes
    while (!result[result.length - 1]) {
        result.pop();
    }
    return result;
};
LargeInt.add = function(lh, rh) {
    var result = [];
    var len = lh.length > rh.length ? lh.length : rh.length;
    var remainder = 0;
    for (var i = 0; i < len; i++) {
        var u = (lh[i] || 0) + (rh[i] || 0) + remainder;
        result.push(u % 10);
        remainder = Math.floor(u / 10);
    }
    if (remainder) {
        result.push(remainder);
    }
    return result;
};
LargeInt.create = function(num) {
    if (!Array.isArray(num)) {
        return new LargeInt(num);
    } else {
        var i = new LargeInt(0);
        // Swap in the array.
        i.data = num;
        return i;
    }
};

module.exports.LargeInt = LargeInt;
