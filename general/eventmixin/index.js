(function(exports){

var nextEventId = 1;
var generateEventId = function() {
    return nextEventId++;
};


/**
 * Provides a very simple publisher/subscriber mixin.
 *
 * The interface has:
 * * eventSub
 * * eventPub
 * * eventClear
 *
 * Objects can subscribe to custom events via:
 *
 *     obj.eventSub(event, subscriber)
 *
 * Events can be triggered with:
 *
 *     obj.eventPub(name[, arguments])
 *
 * Events can be cleared with:
 *
 *     obj.eventClear([id])
 *
 * @name EventMixin
 * @class
 */
var EventMixin = function(){};
EventMixin.prototype = {
    //-------------------------------------------- Private Fields
    /**
     * Private cache for all listeners for current object.
     * Object properties act as event names holding callbacks in arrays.
     * @type Array{}
     */
    _eventSubs: null,

    //-------------------------------------------- Public Interface
    /**
     * Subscribe to an event.
     * @param event {String} The name of the custom event published.
     * @param subscriber {Function} The function that will be called when the
     * custom event is triggered.
     */
    eventSub: function(event, subscriber) {
        var subs = this._eventSubs;
        var _eventId = generateEventId();

        if (typeof event != "string") {
            throw new Error("Event name must be a string.");
        }

        // Lazy create event cache.
        if (!subs) {
            subs = this._eventSubs = Object.create(null);
        }
        if (subs[event] === undefined) {
            subs[event] = [];
        }

        // Add an id to the callback.
        subscriber._eventId = _eventId;

        subs[event].push(subscriber);

        return _eventId;
    },

    /**
     * Publish a particular named event.
     * @param name {String} The name of the custom event to fire.
     * @param [arguments] {mixed} A variable list of arguments passed as formal
     * parameters to the callbacks. No implicit arguments are passed to
     * listeners.
     */
    eventPub: function(name/*[, other arguments]*/) {
            // Grab formal arguments to pass, if any.
        var args = Array.prototype.slice.call(arguments, 1),
            // counter
            i,
            eventSubs = this._eventSubs[name],
            numEventSubs;

        if (eventSubs) {
            numEventSubs = eventSubs.length;
            for (i = 0; i < numEventSubs; i++) {
                eventSubs[i].apply(this, args);
            }
        }
    },

    /**
     * @param [id] {mixed} If undefined, all events are cleared. If a string,
     * just that event category is cleared. If a number, the event of that
     * id is cleared.
     */
    eventClear: function(id) {
        var subs, ev, i, numListeners;

        if (id === undefined) {
            // Drop all events.
            this._eventSubs = Object.create(null);
        }
        else if (typeof id == "string") {
            // Drop only this event.
            this._eventSubs[id] = null;
        }
        else if (typeof id == "number") {
            // Drop an event by id.
            subs = this._eventSubs;
            for (ev in subs) {
                // Remap to ease access.
                ev = subs[ev];
                if (Array.isArray(ev)) {
                    numListeners = ev.length;
                    for (i = 0; i < numListeners; i++) {
                        if (ev[i]._eventId == id) {
                            ev.splice(i, 1);
                            // Break, we're done.
                            return;
                        }
                    }
                }
            }
            // TODO: Return error if id not exists?
            //console.warn("Attempting to remove nonexistant id: " + id);
        }
        else {
            throw new Error("Called eventClear with incorrect type of: " + typeof id);
        }
    },
};



exports.EventMixin = EventMixin;

})(this);
