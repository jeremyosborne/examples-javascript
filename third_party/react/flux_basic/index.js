/* jshint node:true, unused:true, undef:true */

var Dispatcher = require('flux').Dispatcher;


var dispatcher = new Dispatcher();

var digitizerStore = Object.create({
    dispatchCallbackGen: function() {
        return function(payload) {
            if (payload.type === "robot") {
                var digitized = "";
                for (var i = 0; i < payload.sound.length; i++) {
                    digitized += Math.random() > 0.5 ? 1 : 0;
                }
                payload.sound = digitized;
            }
        }.bind(this);
    }
});


var soundStore = Object.create({
    dispatchCallbackGen: function() {
        return function(payload) {
            dispatcher.waitFor([digitizerStore.dispatchToken]);
            console.log("got TEST type", payload);
        }.bind(this);
    }
});

// Test waitFor coroutine like behavior.
soundStore.dispatchToken = dispatcher.register(soundStore.dispatchCallbackGen());
digitizerStore.dispatchToken = dispatcher.register(digitizerStore.dispatchCallbackGen());


dispatcher.dispatch({
    type: "animal",
    sound: "moooo",
});

dispatcher.dispatch({
    type: "animal",
    sound: "wooof",
});

dispatcher.dispatch({
    type: "robot",
    sound: "I'll be back",
});
