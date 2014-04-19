define("chatform", ["jquery", "notifications"], function($, notifications) {
    //console.log("loading chathistory");

    var apiURL = "http://bro.jeremyosborne.com/api/messagebro";
    var chatForm = '<form action="javascript:void(0);" class="chat-form"><input type="text" name="user" class="user" placeholder="user"/><input type="text" name="message" class="message" placeholder="message"/><input type="submit"></form>';

    var sendMessage = function(e) {
        var user = $(this).find(".user").val();
        var message = $(this).find(".message").val();

        e.preventDefault();

        if (!user || !message) {
            notifications.add("please fill out both user and message fields");
            return;
        }
        $.ajax(apiURL, {
                data: $(this).serialize(),
                method: "POST"
            })
            .done(function(data, status, xhr) {
                //console.log("chat form response status:", status);
                //console.log("chat form data received:", data);
                notifications.add("chat message successfully sent.");
            })
            .fail(function(xhr, status, e) {
                notifications.add("chat form error: " + status);
            });
    };

    var render = function() {
        var form = $(chatForm);
        $("body").append(form);
        form.on("submit", sendMessage);
    };

    return {
        render: render
    };
});
