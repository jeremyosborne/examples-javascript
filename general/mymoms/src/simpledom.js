(function(window, document, undefined) {

    //------------------------------------------ Private Functions and Objects
        /*
         * We use slice in multiple places.
         */
    var slice = Array.prototype.slice,
        /*
         * Helper for our querySelector method.
         * We assume that the querySelectorHelper will only return
         * one result in a non array.
         * @type function
         * @default undefined
         */
        querySelectorHelper,
        /*
         * Helper for our querySelectorAll method.
         * @type function
         * @default undefined
         */
        querySelectorAllHelper;

    //---------------------------------------------- IE Fixits
    // Fix the slice method to work with host objects if we need to.
    (function() {
        var test = document.createElement("div");
        try {
            // Make siblings so we have a nodelist
            test.innerHTML = "<div></div><div></div>";
            slice.call(test.childNodes);

        } catch (e) {
            // Rewrite slice for IE.
            slice = function() {
                var a = [],
                    length = this.length,
                    i;

                for (i = 0; i < length; i++) {
                    a[i] = this[i];
                }

                return a;
            };
        }
    })();

    //---------------------------------------------- Event helpers and wrappers
    /*
     * Slightly normalize some of the more annoying aspects of cross-browser
     * event objects.
     * @param fn {function} A function we intend to subscribe to a particular
     * DOM event.
     * @return {function} A wrapped function ready to be subscribed to a particular
     * event.
     */
    var addEventWrapper = function(fn) {
        var wrapped = function(event) {
            var fixedEvent = {},
                i;

            event = event || window.event;
            for (i in event) {
                fixedEvent[i] = event[i];
            }


            // Some fixing.
            if (!fixedEvent.target) {
                // Props to jQuery for the following hint on target setting.
                fixedEvent.target = event.srcElement || document;
            }
            if (!fixedEvent.which) {
                // Again props to jQuery. All I am looking for here is the
                // keycode.
                fixedEvent.which = event.charCode || event.keyCode;
            }
            if (fixedEvent.pageX === undefined && event.clientX !== undefined) {
                fixedEvent.pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                fixedEvent.pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            // Override the function
            fixedEvent.preventDefault = function() {
                if (event.preventDefault) {
                    // !IE
                    event.preventDefault();
                }
                else {
                    // IE
                    event.returnValue = false;
                }
            };

            // Correct calling context back to element
            fn.call(this, fixedEvent);
        };

        return wrapped;
    };
    /*
     * An overly simple event registry: one subscriber function per event per
     * element.
     * @param type {string} The base name of the event. For example,
     * pass in "click" for single click events, "onclick" would be incorrect.
     * A list of event names can be found
     * <a href="http://www.quirksmode.org/dom/events/index.html">here</a>.
     * There is no validity checking on the name of the event.
     * @param fn {function} The event handling function to attach to this
     * event. Irrespective of browser type, all functions will be passed the event
     * object that is slightly normalized.
     */
    var onUtil = function(type, fn) {
        // NOTE: Only call this function from the context of self.

        // Wrap up our function
        this['on'+type] = addEventWrapper(fn);
    };

    /*
     * Remove a function subscribed to a DOM element's event.
     * @param type {string} The base name of the event. For example,
     * pass in "click" for single click events, "onclick" would be incorrect.
     * A list of event names can be found
     * <a href="http://www.quirksmode.org/dom/events/index.html">here</a>.
     * There is no validity checking on the name of the event.
     */
    var offUtil = function(type) {
        // NOTE: Only call this function from the context of self.

        // Sometimes oldskool really can be okay-enough.
        // NOTE on IE: During some testing recently (10/1/2011) I noticed
        // that in my version of IE8, if I set an event listener property
        // to the value undefined, it caused IE8 to throw a really weird
        // error that Qunit output as:
        //    Died on test #3: Not implemented - { "name": "Error",
        //    "number": -2147467263, "description": "Not implemented ",
        //    "message": "Not implemented " }
        // That's far from the weirdest shit I've seen, but that ranks up
        // there with most of the stupid crap I run into.
        // Go figure, setting to null is just fine.
        this['on'+type] = null;
    };

    //-------------------------------------------------- HTML Classname helpers
    /*
     * Build a regular expression that can match an value of an HTML class
     * attribute.
     * @param className {string} The single class to check for.
     */
    var makeClassRE = function(className) {
        return new RegExp("(^|\\s)"+className+"(\\s|$)");
    };

    /*
     * If an element has a particular class, remove it.
     * Designed to by invoked via a call to the Function prototype method
     * apply.
     * @param className {string} The single class to remove.
     */
    var classRemoveUtil = function(className) {
        var re = makeClassRE(className),
            self = this;

        self.className = self.className
            // Remove the class
            .replace(re, " ")
            // Trim any leading or trailing white space
            .replace(/^\s+|\s+$/g,"");
    };

    /*
     * If an element does not yet have a particular class, add it.
     * Designed to by invoked via a call to the Function prototype method
     * apply.
     * @param className {string} The single class to add.
     */
    var classSetUtil = function (className) {
        var re = makeClassRE(className),
            self = this;

        if (re.test(self.className) === false) {
            if (self.className.length > 0) {
                // Some class exists, add a separator
                self.className += " " + className;
            } else {
                self.className += className;
            }
        }
    };

    //-------------------------------------------------- Query Selector Helpers
    /*
     * Wrapper for our underlying querySelector method. Allows us to wrap our
     * finder up via some other query selector like jQuery, should we need it
     * for our older, more lame browsers.
     * Assume function invocation via call or apply.
     * @param selector {string} A valid CSS selector.
     * @return {HTMLElement|undefined} Returns a single HTML element, or null
     * if no element can be found and a querySelector is available, or undefined
     * if we have no querySelector.
     */
    var querySelectorUtil = function(selector) {
        var self = this;

        if (self.querySelector) {
            // we assume that the querySelector is probably available
            return self.querySelector(selector);
        }
        else if (querySelectorHelper) {
            // We assume that the querySelectorHelper will only return
            // one result in a non array.
            return querySelectorHelper.call(self, selector);
        }
        else {
            // We fail, we have no query selector to help us.
            return undefined;
        }
    };

    /*
     * Wrapper for our underlying querySelectorAll method. Allows us to wrap our
     * finder up via some other query selector like jQuery, should we need it
     * for our older, more lame browsers.
     * Assume function invocation via call or apply.
     * @param selector {string} A valid CSS selector.
     * @return {HTMLElement[]|undefined} Returns a nodelist, either containing
     * elements or no elements depending on the success of the selector, or
     * undefined if we have no querySelectorAll.
     */
    var querySelectorAllUtil = function(selector) {
        var self = this;

        if (self.querySelectorAll) {
            // we assume that the querySelector is probably available
            return self.querySelectorAll(selector);
        }
        else if (querySelectorAllHelper) {
            // We assume that the querySelectorHelper will only return
            // one result in a non array.
            return querySelectorAllHelper.call(self, selector);
        }
        else {
            // We fail, we have no query selector to help us.
            return undefined;
        }
    };

    //----------------------------------- DOM Manipulation utils

    /**
     * Take an HTML string and return an array of elements created from the
     * string.
     * @param html {string} An HTML string.
     * @return {HTMLElement[]} An array of HTML elements created from the
     * string.
     */
    var buildHTMLFromString = function(html) {
        var makerDiv = document.createElement("div");
        makerDiv.innerHTML = html;

        return slice.call(makerDiv.childNodes);
    };

    //----------------------------------- simpledom Object Constructor and utils

    /*
     * Determine if this node should be skipped.
     * Current special nodeNames: #text.
     * @return {boolean} true if the node should be skipped node, false if not.
     */
    var skipThisNode = function(el) {
        switch(el.nodeName) {
            case "#text":
                return true;
            default:
                return false;
        }
    };

    /*
     * Iterate over each element in a group, possibly changing items in the
     * group, and possibly removing items from the group.
     * @param elements {HTMLElement[]} An array of HTML elements.
     * @param operation {function} A function that will be applied to each
     * element in the list. If the function returns the false (as in === false)
     * the element will be removed from the list.
     * @param [args] {mixed[]} An array of arguments to pass in as formal
     * arguments to each call of the operation, or none if no arguments should
     * be passed in.
     * @param [skipSpecialNodes=false] {boolean} If truthy, the foreach loop
     * will skip any special element.
     * Special elements have the following nodeNames: #text.
     * @return {HTMLElement[]} An array of HTMLElements.
     */
    var foreach = function(elements, operation, args, skipSpecialNodes) {
        var elementsReturned = [],
            i,
            numElements = elements.length,
            elementForOp,
            opResults;

        // Another IE fix.
        // IE doesn't like apply called with an empty arg array,
        // fuckIEng stupid.
        args = args || [];

        for (i = 0; i < numElements; i++) {
            elementForOp = elements[i];
            if (!skipSpecialNodes || (skipSpecialNodes && !skipThisNode(elementForOp))) {
                opResults = operation.apply(elementForOp, args);
                if (typeof opResults !== false) {
                    elementsReturned.push(elementForOp);
                }
            }
        }

        return elementsReturned;
    };

    /*
     * Construct the simpledom object and return.
     * @param elements {HTMLElement|HTMLElements[]} A collection of HTML
     * Elements. Can a single element, an array, or a Nodelist.
     * @return {HTMLElements[]} A real and extended JavaScript array containing
     * the current HTMLElements available in our query. If no elements are
     * available, array will still be returned and the length will be zero.
     */
    var buildSimpleDom = function(elements) {
        if (!elements.length && elements.length !== 0 || elements === window) {
            // Place into true array
            elements = [elements];
        }

        // Make sure this is a native array type
        elements = slice.call(elements);

        // Attach invokable operations
        elements.append = append;
        elements.classRemove = classRemove;
        elements.classSet = classSet;
        elements.empty = empty;
        elements.find = find;
        elements.findAll = findAll;
        elements.hide = hide;
        elements.on = on;
        elements.off = off;
        elements.offset = offset;
        elements.parent = parent;
        elements.remove = remove;
        elements.show = show;
        elements.styleSet = styleSet;

        return elements;
    };



    //--------------------------------------------- Simpledom and Public Methods

    /**
     * Inserted elements will be created, if passed in has a string, and
     * appended to the first element in the list if that element can
     * have other elements appended to it.
     * If the method is set to clone, which will use the DOM cloneNode,
     * the elements will be created, cloned, and appended onto each
     * element in the simpledom.
     * REMINDER: If cloneNode is invoked, previously setup event handlers
     * will not be propagated. Add event handlers last, only after appending.
     * @param elements {string|HTMLElement[]} Either an HTML string or an array
     * of HTML elements to be appended.
     * @param [clone=false] {boolean} If true, the elements will be replicated
     * via cloneNode onto each element. The default, false, will only append
     * the elements to the first element in the list, if elements can
     * be appended to that node.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var append = function(elements, clone) {
            // We *assume* that we have only 1 of the follwoing:
            // - If a string, build an array of HTMLElements, fall through
            //   to last.
            // - If not a string, and not an array, than we assume we have
            //   an HTMLElement and place it in an array, fall through to last.
            // - If clone == false == default == not cloning: try to append
            //   elements to the first simpledom element and then return.
            // - If clone == true == deep clone: deep clone each node
            //   in elements and append to each non-special element.

            // We don't have a way to quit out of the foreach loop.
            // If we only want one append, this will protect us.
        var skipRemainder = false;

        if (typeof elements == "string") {
            // Make a nodelist of elements via innerHTML.
            elements = buildHTMLFromString(elements);
        }

        if (!elements.length && elements.length !== 0) {
            // Don't create an empty array of arrays.
            elements = [elements];
        }

        elements = foreach(this, function(els) {
            /*jshint -W030 */
            var i,
                numEls = els.length,
                el;

            for (i = 0; i < numEls; i++) {
                el = els[i];
                // Empty strings do not make nodes when innerHTML'd
                if (clone) {
                    if (el.cloneNode) {
                        // Only append if we can
                        this.appendChild && this.appendChild(el.cloneNode(true));
                    }
                }
                else if (!skipRemainder && el) {
                    // Only append once and don't use cloneNode, mainly so
                    // we can preserve event settings, and support the common
                    // usage of this method.
                    this.appendChild && this.appendChild(el);
                }
            }
            // Only respected when we are not cloning, but set no matter what.
            // Once we have gone once through, ignore the rest of the nodes.
            skipRemainder = true;
        }, [elements], true);

        return buildSimpleDom(elements);
    };



    /**
     * Iterate over each element and add an additional value to the HTML class
     * attribute if it doesn't already exist.
     * @param className {string} The new HTML class to add to the elements
     * in the simpledom.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var classSet = function(className) {
        var elements = foreach(this, classSetUtil, [className], true);

        return buildSimpleDom(elements);
    };



    /**
     * Iterate over each element and remove a value from the HTML class
     * attribute if it exists.
     * @param className {string} The HTML class to remove from the elements
     * in the simpledom.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var classRemove = function(className) {
        var elements = foreach(this, classRemoveUtil, [className], true);

        return buildSimpleDom(elements);
    };



    /**
     * Empties out each element in the simpledom, does not change the number
     * of elements within the simpledom.
     * This is potentially a very unfriendly function, as it carelessly sets
     * the value of innerHTML to an empty string for each element.
     * You have been warned.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var empty = function() {
        var elements;

        elements = foreach(this, function() {
            this.innerHTML = "";
        });

        return buildSimpleDom(elements);
    };



    /**
     * Add subscribers to a specifically named HTML DOM event.
     * This is old school event handling under the covers: only one subscriber
     * per event.
     * However, event objects will always be passed to the subscriber as the
     * first and only argument, and some normalization of event object
     * properties is performed.
     * @param type {string} The plain name of event: "mouseover" not
     * "onmouseover".
     * @param subscriber {function} The function that will be called when the
     * element experiences the event.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var on = function(type, subscriber) {
        var elements;

        elements = foreach(this, function(t, s) {
            onUtil.call(this, t, s);
        }, [type, subscriber], true);

        return buildSimpleDom(elements);
    };



    /**
     * Remove subscribers from a specifically named HTML DOM event.
     * @param type {string} The plain name of event: "mouseover" not
     * "onmouseover". As events can only have one listener, no need to pass
     * in the subscribing function.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var off = function(type) {
        var elements;

        elements = foreach(this, function (t) {
            offUtil.call(this, t);
        }, [type], true);

        return buildSimpleDom(elements);
    };


    /**
     * Calculate the absolute page offset of the first element in the a$$
     * array.
     *
     * Thanks to jQuery for the majority of this code!
     *
     * @return {Object} An object consisting of a "top" and "left"
     * property that contain the positioning of the first element in the a$$
     * relative to the upper left of the document. If the a$$ does not
     * contain any elements, the same object will be returned, but "top" and
     * "left" will be set to undefined.
     * @methodOf a$$
     */
    var offset = function() {
        if (this.length) {
            // Thanks to jQuery for this code!
            var box = this[0].getBoundingClientRect();
            var clientTop  = document.documentElement.clientTop  || document.body.clientTop  || 0;
            var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        else {
            return {
                top: undefined,
                left: undefined
            };
        }
    };


    /**
     * Iterate over each item in order, applying the selector to each, and
     * returning the first result found in a simpledom selector.
     * @param selector {string} A valid CSS selector. If available, the browser
     * will use querySelector to find the elements. Otherwise, the selector
     * will have to be delegated to a helper function, or the selection will
     * simply fail.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var find = function(selector) {
        var elementReturned = [];
        var self = this;
        var i;
            // Total number of elements to test
        var numElements = self.length;
        var selectorResult;

        for (i = 0; i < numElements; i++) {
            // There can be...
            selectorResult = querySelectorUtil.call(self[i], selector);
            if (selectorResult) {
                elementReturned[0] = selectorResult;
                // ...only one.
                break;
            }
        }

        return buildSimpleDom(elementReturned);
    };



    /**
     * Iterate over each item in order, applying the selector to each, and
     * returning the results of the selector from all elements as a flat
     * set.
     * @param selector {string} A valid CSS selector. If available, the browser
     * will use querySelectorAll to find the elements. Otherwise, the selector
     * will have to be delegated to a helper function, or the selection will
     * simply fail.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var findAll = function(selector) {
        var elementsReturned = [];
        var i;
        var self = this;
        // Total number of elements to test
        var numElements = self.length;
        var selectorResults;

        for (i = 0; i < numElements; i++) {
            // There can be...
            selectorResults = querySelectorAllUtil.call(self[i], selector);
            // ...many more than one
            elementsReturned = elementsReturned.concat(slice.call(selectorResults));
        }

        return buildSimpleDom(elementsReturned);
    };



    /**
     * Iterate over each element and mark with an inline display:none CSS rule.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var hide = function() {
        var elements = styleSet.call(this, "display", "none");

        return buildSimpleDom(elements);
    };



    /**
     * Gets the parent node of the first element in the simpledom. Be careful,
     * as an empty simpledom will be returned if the first node has no
     * parent.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var parent = function() {
        var parent = [];

        // Will return empty if we have no parent.
        if (this && this.length && this[0].parentNode) {
            parent[0] = this[0].parentNode;
        }

        return buildSimpleDom(parent);
    };



    /**
     * Remove all elements from the HTML DOM by calling removeChild on them
     * from their parentNode, but only if they have a parentNode.
     * Whether or not existing elements are actually removed, they will
     * remain in the simpledom.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var remove = function() {
        /*jshint -W030 */
        var elements;

        elements = foreach(this, function() {
            this && this.parentNode && this.parentNode.removeChild && this.parentNode.removeChild(this);
        });

        return buildSimpleDom(elements);
    };



    /**
     * Iterate over each element and remove any inline display:none CSS rule.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var show = function() {
        var elements = styleSet.call(this, "display");

        return buildSimpleDom(elements);
    };



    /**
     * Sets a particular CSS style on the style object of each element
     * contained within the simpledom.
     * A good way to turn off a CSS rule is to pass in an empty string "" as
     * the value.
     * @param rule {string} The CSS rule to set.
     * @param [value=""] {string} The CSS value to apply to the rule.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @methodOf a$$
     */
    var styleSet = function(rule, value) {
        var elements;

        // Assume an undefined value to be equivalent to an empty string
        value = value || "";
        elements = foreach(this, function(r, v) {
            // Only apply the rule if a style object is available
            if (this.style) {
                this.style[r] = v;
            }
        }, [rule, value], true);

        return buildSimpleDom(elements);
    };


    /**
     * @class
     * The entrypoint for simpledom manipulations.
     *
     * A simpledom object is an extended native array object.
     *
     * simpledom does not extend or modify the prototype of the native array
     * type.
     *
     * simpledom calls are chainable.
     *
     * Even if one element is found, or no elements are found, an array
     * will be returned containing the 0, 1, or many elements. The elements
     * are pure, unmodified DOM Elements.
     *
     * @example
     * // Remove the "yellow-bus" class from all div elements on the page
     * a$$().findAll("div").classRemove("short-yellow-bus");
     * // Hide all divs on the page
     * a$$("div").hide();
     * // Return two newly created div elements in the simpledom array.
     * // Note: If you are reading the source code for this comment, it is
     * // assumed you are passing in actual less than signs, not the HTML
     * // entity equivalents.
     * a$$("&lt;div>&lt;/div>&lt;div>&lt;/div>");
     *
     * @param [beginning=document] {HTMLElement|string} Where to begin the
     * selection entry point. Defaults to the document for all search
     * purposes. If a string is passed in, simpledom, being simple, will do
     * one of two things with the string:
     * - If the string begins with a less than sign at byte 0 of the string,
     * the string is assumed to be HTML and will be innerHTML'd to create the
     * starting elements.
     * - If the string begins with anything else, it is assumed to be a query
     * selector and will be passed to the equivalent querySelectorAll available
     * to simpledom, with the document object as the context, and the results
     * will be returned in the resulting simpledom object.
     * @return {a$$} All calls to simpledom methods will always return another
     * simpledom object, with the reference point relative to whatever
     * array of elements are available.
     * @static
     * @name a$$
     */
    var a$$ = function(beginning) {
            // Either a Node/Nodelist or document
        var elements = beginning || document;

        // Check to see if the beginning is a string
        if (typeof elements == "string") {
            // We *assume* that we have only 1 of two things:
            // - An html string if the string begins with a less-than sign.
            // - A selector if the string does not begin with a less-than sign.
            if (elements[0] == "<") {
                // Make a nodelist of elements via innerHTML.
                elements = buildHTMLFromString(elements);
            }
            else {
                // Make a nodelist of elements via a call to querySelectorAll
                elements = querySelectorAllUtil.call(document, elements);
            }
        }

        // Pass back the simpledom object
        return buildSimpleDom(elements);
    };
    // export
    window.a$$ = a$$;

})(window, document);
