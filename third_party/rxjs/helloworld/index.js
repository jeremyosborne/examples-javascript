var Rx = require("rxjs");
var request = require("request");



var jsonSourceFactory = function(url) {
    url = url || "http://bro.jeremyosborne.com/api/lorembro?data=json";

    return Rx.Observable.create(function (observer) {

        observer.onNext({
            status: "Making request to: " + url,
            content: null,
        });
        request(url, function(err, res, content) {
            if (err) {
                observer.onError(err);
            }
            else {
                observer.onNext({
                    status: "Request done.",
                    content: content
                });
                // Done is done, can't pass arguments.
                observer.onCompleted();
            }
        });

        // Cleanup function.
        return function () {
            console.log('Request source done.');
        };
    });
};



var main = function() {
    var subscription = jsonSourceFactory().subscribe(
        // Next (like an update or in process).
        function (message) {
            console.log(message.status);
            if (message.content) {
                try {
                    JSON.parse(message.content);
                    console.log("Got JSON back.");
                }
                catch(e) {
                    console.log("Didn't get JSON back.");
                }
            }
        },
        // Error.
        function (err) {
            console.log('Haz error: ' + err);
        },
        // Done.
        function () {
            console.log('Completed');
        });

    // Explicit disposal.
    // DON'T DO THIS in this example if you want data back.
    // This will kill the subscription.
    //subscription.dispose();
};



if (require.main === module) {
    main();
}

