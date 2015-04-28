define("chathistory", ["backbone", "underscore", "chatmessage", "notifications"], function(Backbone, _, ChatMessage, notifications) {
    //console.log("loading chathistory");

    var apiURL = "http://bro.jeremyosborne.com/api/messagebro?history=1";
    // Moustache/handlebar like templates.
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g,
        evaluate: /\{\%(.+?)\%\}/g
    };
    var chatHistoryTemplate = _.template($("#chat-history-template").html());

    var ChatHistoryController = Backbone.Collection.extend({
        model: ChatMessage,
        url: apiURL,
        initialize: function() {
            setInterval(_.bind(this.fetchModels, this), 3000);
        },
        parse: function(response) {
            // Called by backbone. Reference models only, ignore meta data.
            return response.messages;
        },
        // The bare fetch method comes from backbone. Others are our own
        // extensions.
        fetchModels: function() {
            this.fetch({
                reset: true,
                // sync will handle the success
                error: this.fetchFail
            });
        },
        fetchFail: function(collection, data) {
            notifications.add("chat history fetch error.");
        }
    });

    var ChatHistoryView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, "reset", this.render);
        },
        className: "chat-history",
        template: chatHistoryTemplate,
        render: function() {
            this.$el.html(this.template({
                models: this.collection.toJSON()
            })).appendTo("body");
        }
    });

    return {
        render: function() {
            var chv = new ChatHistoryView({
                collection: new ChatHistoryController()
            });
            chv.render();
        }
    };
});
