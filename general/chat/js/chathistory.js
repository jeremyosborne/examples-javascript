define("chathistory", ["jquery", "underscore", "chatmessage", "notifications"], function($, _, ChatMessage, notifications) {
    //console.log("loading chathistory");

    var apiURL = "http://bro.jeremyosborne.com/api/messagebro?history=1";
    var chatHistoryContainer = "<div class='chat-history'><div class='loading'>loading history</div></div>";
    var chatMessageTemplate = "<div class='chat-message'><div class='user'></div><div class='date'></div><p class='message'></p></div>";

    var renderMessage = function(cm) {
        var template = $(chatMessageTemplate);

        // Remove any previous loading message.
        $(".chat-history .loading").remove();

        // Take a model and make it HTML.
        template.find(".user").html(cm.get("user"));
        template.find(".date").html(cm.get("date"));
        template.find(".message").html(cm.get("message"));

        // Add to page in reverse chronology.
        $(".chat-history").prepend(template);
    };

    // Cache of messages.
    var messageHistory = [];
    var addMessages = function(data) {
        // If message is not in the history, add it to the page.
        var messages = data.messages;
        var m, i;

        for (i = messages.length-1; i >= 0; i--) {
            // Only add to page if it doesn't yet exist in memory.
            m = _.find(messageHistory, function(item) {
                return item.get("id") === messages[i].id;
            });
            if (!m) {
                m = new ChatMessage(messages[i]);
                messageHistory.push(m);
                renderMessage(m);
            }
        }
    };

    var pollHistory = function() {
        $.ajax(apiURL)
            .done(function(data, status, xhr) {
                //console.log("chat history response status:", status);
                //console.log("chat history data received:", data);
                addMessages(data);
            })
            .fail(function(xhr, status, e) {
                notifications.add("chat history error: " + status);
            });
    };

    var render = function() {
        $("body").append(chatHistoryContainer);
        // begin polling only after we render.
        setInterval(pollHistory, 3000);
    };

    return {
        render: render
    };
});
