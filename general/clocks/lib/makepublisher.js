/**
 * @fileoverview Defines the makePublisher interface.
 */
/**
 * Implements a very simple publisher/subscriber interface to whatever
 * object is passed in.
 *
 * The interface requires the following fields be undefined on the object:
 * subscribe
 * and
 * trigger
 *
 * After application of the interface, the methods work as follow:
 *
 * Objects can subscribe to custom events via:
 * obj.subscribe(event, subscriber, context)
 * Where:
 * event {string} The name of the custom event published by obj.
 * subscriber {function} The function that will be called when the custom event
 * is triggered.
 * [context] {object} The default context in which subscriber is called is the
 * obj on which the subscriber interface is added. If you wish another object
 * to be the 'this' context of the function call, pass that object in as the
 * context argument.
 *
 * and
 *
 * The publisher obj can trigger custom events via:
 * obj.trigger(name[, arguments])
 * Where:
 * name {string} The name of the custom event to fire.
 * [, arguments] {mixed} A comma delimited list of formal parameters that will
 * be passed on to the subscribed functions as formal paramters. The name of
 * the custom event will not be passed on, as such all n[1+...] arguments will
 * be passed to all subscribing functions as a set of n arguments.
 *
 * @name makePublisher
 * @static
 * @param obj {object} Object on which to make a publisher. Be careful what
 * object you are passing in, for example obj should not be the jQuery object
 * unless you wish to apply the interface to the-great-$.
 */
(function(){

    function makePublisher(obj) {
        //-------------------------------------------- Publisher Private Fields
            /*
             * Private cache for all function subscribers for current object.
             * This cache is not shared among objects.
             * Object acts as a map each named custom event.
             * Object properties act as event names.
             * Event names point to an array of subscribers.
             * @type object
             */
        var subscribers = {},
            /*
             * Bind reference to the publishing object to prevent potential
             * problems with out of context this.
             * @type object
             */
            self = obj;

        //------------------------------------------- Verification
        if (obj.subscribe || obj.trigger) {
            // DEBUG
            //log("already implemented subscribe or trigger methods.");
            return;
        }

        //-------------------------------------------- Public Interface Methods
        obj.subscribe = function(event, subscriber, context) {
            // Calling context will be publisher object or a delegate
            context = context || self;

            // 1) Check if the event has been created and exists
            // 2) If not, add the event as a key to subscribers
            //    and point the key to a storage array for callback functions.
            if (subscribers[event] === undefined) {
                subscribers[event] = [];
            }

            // Callbacks will always be called assuming they expect variable
            // arguments to be passed in.
            // Arguments passed directly to the callback wrapper will always be
            // passed in as a single formal parameter that will always be an
            // array, whether or not there are any arguments to pass through.
            // Arguments will be unpacked and passed through as formal
            // arguments, via the apply method, as they are passed into the
            // actual wrapped call back.
            subscribers[event].push(function(args) {
                if (args.length) {
                    subscriber.apply(context, args);
                }
                else {
                    subscriber.apply(context);
                }
            });
        };

        // Trigger is a varargs function.
        // Trigger takes all function arguments minus the name argument
        // and passes through to the subscribers.
        obj.trigger = function(name) {
                // For the arguments to be passed as formal arguments to our
                // subscribers, we need to wrap them up in an array.
            var functionArgs = Array.prototype.slice.call(arguments, 1),
                // counter
                i,
                eventSubscribers = subscribers[name],
                numEventSubscribers;

            if (eventSubscribers) {
                numEventSubscribers = eventSubscribers.length;
                for (i = 0; i < numEventSubscribers; i++) {
                    eventSubscribers[i](functionArgs);
                }
            }
        };
    }

    window.makePublisher = makePublisher;

})();
