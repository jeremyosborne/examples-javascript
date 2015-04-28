require.config({
    paths: {
        fiber: 'http://cdnjs.cloudflare.com/ajax/libs/fiber/1.0.5/fiber.min',
        jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
        underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min'
    },
    shim: {
        // Make underscore behave with requirejs.
        "underscore": {
            exports: "_"
        }
    }
});
require(["chathistory", "chatform"], function(chathistory, chatform) {
    //console.log("loading app");

    //var apiURL = "http://bro.jeremyosborne.com/api/messagebro";
    //
    // get the message history
    //
    //?history=1
    //
    // send a message
    //
    //?user=bro&message=some%20urlencoded%20message

    chatform.render();
    chathistory.render();
});

