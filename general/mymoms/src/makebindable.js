(function(exports) {



/**
 * Implementation of the JavaScript bind interface.
 * For the best description of bind, see:
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
 *
 * Bind is a var args function.
 * The first parameter is defined.
 * Any additional parameters are optional, and will be passed as the
 * first -> nth formal parameters whenever the bound version of the function is
 * called.
 *
 * @example
 * // assuming f is a function object that as the bind method.
 * // f.bind can now be called.
 * otherF = f.bind(myContext, oneStaticArg, anotherStaticArg);
 * // and I can call otherF which will always have the calling context, the
 * // 'this' reference, of whatever myContext is.
 * // oneStaticArg will always be passed in as the first argument to f.
 * // anotherStaticArg will always be passed in as the second argument to f.
 *
 * // The following example:
 * otherF(otherArg1);
 * // Is equivalent to calling:
 * // f.apply(myContext, [oneStaticArg, anotherStaticArg, otherArg1]);
 * @param context {object} An object that will, forevermore, be used as the
 * 'this' context when calling the returned, bound version of the function.
 * @returns {function} A context bound version of the function object, with
 * optially bound formal paremters.
 * @static
 * @function
 * @name bind
 */
var bind = function(context){

    var slice = Array.prototype.slice,
        staticArgs = slice.call(arguments, 1),
        __method = this;

    // Clean up context
    // Allow everything except undefined, which we reset to null.
    // It is callers responsibility to correctly define context.
    context = (typeof context == "undefined") ? null : context;

    return (function() {
        var additionalArgs = slice.call(arguments, 0);
        return __method.apply(context, staticArgs.concat(additionalArgs));
    });
};



/**
 * Adds the bind interface to a JavaScript function object.
 * @example
 * // Add the bind interface to f, assuming f is a function.
 * makeBindable(f);
 * // Add the bind interface to the Function.prototype
 * makeBindable(Function.prototype);
 * @param funct {function} The function object we wish to attach the bind
 * function to. Since the semantics of bind do not apply to other objects, only
 * functions are granted the bind interface.
 * @static
 * @function
 * @name makeBindable
 */
exports.makeBindable = function(funct) {
    if (!funct.bind) {
        funct.bind = bind;
    }
};



})(this);
