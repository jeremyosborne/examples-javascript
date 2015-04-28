$(document).ready(function() {

    // Configure Handlebars.
    Handlebars.registerHelper('prettyDate', function(date) {
        // Assume we get some sort of date string, pass to momentjs.
        return moment(date).fromNow();
    });

    var apiURL = "http://bro.jeremyosborne.com/api/messagebro";

    // Pub/Sub interface.
    var events = $({});

    // Build template with handlebars.
    var messageTemplate = $("#message-template").html();
    messageTemplate = Handlebars.compile(messageTemplate);
    // Render the messages into the page.
    events.on("message-history-retrieved", function(e) {
        // Diagnostic.
        //console.log(arguments);
        var messagesHTML = _.map(e.payload.messages, function(message) {
            return messageTemplate(message);
        }).join("");
        $(".message-history").html(messagesHTML);
    });



    // Retrieve the message history periodically.
    var retrieveMessageHistory = function() {
        $.ajax({
            url: apiURL+"?history=1"
        }).done(function(data) {
            // diagnostic
            //console.log(arguments);
            if (data.messages && data.messages.length) {
                // Signal we have data.
                events.trigger({
                    type: "message-history-retrieved",
                    payload: data
                });
            }
        }).fail(function(xhr) {
            // diagnostic
            //console.log(arguments);
            $("<span>error retrieving message history</span>").notify();
        });
    };
    // Once to load...
    retrieveMessageHistory();
    // ...and then periodically.
    setInterval(retrieveMessageHistory, 5000);



    // Deal with the sending of the message.
    $("#message-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: apiURL,
            method: "GET",
            data: $(this).serialize()
        }).done(function(data) {
            //diagnostic
            //console.log(arguments);
            if (data.status.error) {
                // Signal we have an error.
                console.log("error: couldn't submit: "+data.status.response);
            }
            else {
                // First should always be our message on a success.
                //console.log("message added:", data.messages[0]);
                // Signal we have new data.
                events.trigger({
                    type: "message-history-retrieved",
                    payload: data
                });
            }
        }).fail(function(xhr) {
            // diagnostic
            //console.log(arguments);
            $("<span>error submitting new message</span>").notify();
        });
    });

    // Notify on startup.
    $("<span>welcome to chat</span>").notify();
});
