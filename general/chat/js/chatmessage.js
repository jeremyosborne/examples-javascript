define("chatmessage", ["fiber"], function(Fiber) {
    var ChatMessage = Fiber.extend(function() {
        return {
            init: function(data) {
                // convert date.
                data.date = new Date(data.date);
                this.data = data;
            },
            get: function(key) {
                return this.data[key];
            }
        };
    });

    return ChatMessage;
});
