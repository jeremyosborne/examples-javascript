// Usage:
// $("<span>Cookies are just key value pairs.</span>").notify();

(function($) {

    // Queue of notifications.
    var notifications = [];

    var conf = {
        // Unique classname to add to the notification for identification.
        uniqueClass: "notification-"+(new Date()).getTime(),
        // HTML container for the notifications.
        containerHTML: "<div></div>",
        // Block of CSS to add to the notification container.
        css: {
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            padding: "1.5em",
            textAlign: "center",
            backgroundColor: "#444",
            // Allows us to fade in.
            display: "none",
            color: "#fff"
        },
        // CSS selector that targets where each notification is placed.
        appendTo: "body",

        // How long (ms) will each notification be displayed.
        notifyInterval: 1000
    };
    var notify = function() {
        if (notifications.length && $("."+conf.uniqueClass).size() == 0) {
            $(conf.containerHTML)
                .addClass(conf.uniqueClass)
                .css(conf.css)
                .append(notifications.shift())
                .fadeIn(function() {
                    var self = this;
                    // Done...
                    setTimeout(function() {
                        $(self).fadeOut(function () {
                            $(self).remove();
                            // Stat all over again.
                            notify();
                        });
                    }, conf.notifyInterval);
                })
                .appendTo(conf.appendTo);

        }
    };

    // $.fn === $.prototype
    $.fn.notify = function() {
        // this === the current jQuery object.
        if (this.size() > 0) {
            this.each(function() {
                notifications.push(this);
            });
            notify();
        }
        // Allow people to muck with the notifications more if they wish.
        return this;
    };

}(jQuery));
