define("notifications", ["jquery", "fiber"], function($, Fiber) {
    //console.log("loading notifications.");

    var Notification = Fiber.extend(function() {
        var tag = "<div class='notification'></div>";
        return {
            init: function(message) {
                this.message = message;
            },
            render: function() {
                return $(tag).html(this.message);
            }
        };
    });

    var notificationQueue = [];
    var notificationsRunning = false;
    var showNotifications = function() {
        var showNextNotification = function() {
            var n = $(".notification");
            if (n.length) {
                n.remove();
            }

            if (notificationQueue.length) {
                n = notificationQueue.shift().render();
                $("body").append(n);
                notificationsRunning = setTimeout(showNextNotification, 1500);
            }
            else {
                notificationsRunning = false;
            }
        };
        if (!notificationsRunning) {
            showNextNotification();
        }
        // else do nothing
    };

    var notifications = {
        add: function(message) {
            notificationQueue.push(new Notification(message));
            showNotifications();
        }
    };

    // test
    // notifications.add("hello");
    // notifications.add("world");
    // notifications.add("what's up?");

    return notifications;
});
