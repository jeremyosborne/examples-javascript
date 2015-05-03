/* jshint unused:true, undef:true, node:true */
/* global describe:false, it:false */

var EventMixin = require("../index.js").EventMixin;
var assert = require("assert");



// Changing around old test without rewriting everything.
var eventMixin = function(obj) {
    var prop;
    for (prop in EventMixin.prototype) {
        obj[prop] = EventMixin.prototype[prop];
    }
    return obj;
};


describe("Sanity tests for EventMixin", function() {
    it(".pub('event', oneArg) test.", function() {
            // Our publisher
        var pub = eventMixin({
            name: "call me, "
        });

        // Our subscriber
        var sub = {
            callme: function(input) {
                // Make sure the context is correctly set to 'this'
                // and that we get our correct input
                assert.equal(input + this.name + "call me anytime.",
                    "call me! call me, call me anytime.",
                    "Deborah hairy lyric.");
            }
        };

        pub.eventSub("test", sub.callme);
        pub.eventPub("test", "call me! ");
    });

    it(".pub('event', oneArg) test, with bound subscriber.", function() {
        var pub = eventMixin({});
        var sub = {
            name: "call me, ",
            callme: function(input) {
                console.log(this.name);
                // Make sure the context is correctly set to 'this'
                // and that we get our correct input
                assert.equal(input + this.name + "call me anytime.",
                    "call me! call me, call me anytime.",
                    "Deborah hairy lyric.");
            }
        };

        pub.eventSub("test", sub.callme.bind(sub));
        pub.eventPub("test", "call me! ");
    });

    it(".eventPub() with multiple arguments.", function() {
        var pub = eventMixin({
            name: "call me, "
        });
        // Our subscriber
        var sub = {
            callme: function(input1, input2) {
                assert.equal(input1 + input2 + this.name + "call me anytime.",
                    "call me! call me, call me anytime.",
                    "Deborah hairy lyric.");
            }
        };

        pub.eventSub("test", sub.callme);
        pub.eventPub("test", "call ", "me! ");
    });

    it(".eventPub()", function() {
            // Our publisher
        var pub = {
                name: "call me! call me, "
            },
            // Our subscriber
            sub = {
                callme: function() {
                    // Make sure the context is correctly set to 'this'
                    // and that we get our correct input
                    assert.equal(this.name + "call me anytime.",
                        "call me! call me, call me anytime.",
                        "Deborah hairy lyric.");
                }
            };

        // Make the publisher
        eventMixin(pub);

        // subscribe sub to pub, pub by default is the context
        pub.eventSub("test", sub.callme);
        // Test is performed inside of the subscriber
        pub.eventPub("test");
    });

    it(".eventClear() method removes all listeners.", function() {
        // Our publisher
        var pub = {
            name: "call me! call me, "
        };
        // Our subscriber
        var sub = {
            test: function() {
                counter += 1;
            },
            test2: function() {
                counter += 1;
            }
        };
        var counter = 0;

        // Make the publisher
        eventMixin(pub);

        pub.eventSub("test", sub.test);
        pub.eventSub("test2", sub.test2);

        pub.eventClear();

        pub.eventPub("test");
        pub.eventPub("test2");

        assert.equal(counter, 0, "nothing changed.");
    });


    it(".eventClear('event-name') method removes listeners just for event.", function() {
        // Our publisher
        var pub = {
            name: "call me! call me, "
        };
        // Our subscriber
        var sub = {
            test: function() {
                counter += 1;
            },
            test2: function() {
                counter += 1;
            }
        };
        var counter = 0;

        // Make the publisher
        eventMixin(pub);

        pub.eventSub("test", sub.test);
        pub.eventSub("test2", sub.test2);

        pub.eventClear("test2");

        pub.eventPub("test");
        pub.eventPub("test2");

        assert.equal(counter, 1, "One test cleared, one test run.");
    });


    it(".eventClear(id) method removes only one listener.", function() {
        // Our publisher
        var pub = {
            name: "call me! call me, "
        };
        // Our subscriber
        var sub = {
            test: function() {
                counter += 1;
            },
            test2: function() {
                counter += 1;
            }
        };
        var eventToRemove;
        var counter = 0;

        // Make the publisher
        eventMixin(pub);

        pub.eventSub("test", sub.test);
        eventToRemove = pub.eventSub("test", sub.test);
        pub.eventSub("test2", sub.test2);

        pub.eventClear(eventToRemove);

        pub.eventPub("test");
        pub.eventPub("test2");

        assert.equal(counter, 2, "One test cleared, two tests run.");
    });
});
