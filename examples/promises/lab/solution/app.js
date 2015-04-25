// Hmmm, some bizarre console.log statements appear to be incorrect?
// see: http://stackoverflow.com/questions/17544965/unhandled-rejection-reasons-should-be-empty
Q.stopUnhandledRejectionTracking();

var get = function(u) {
    var deferred = Q.defer();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", u, true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
            deferred.notify("xhr at readyState: " + this.readyState);
        } else {
            if (this.status === 200) {
                deferred.resolve(xhr.responseText);
            } else {
                deferred.reject(new Error("Error code: " + this.status));
            }
        }
    };
    xhr.send(null);
    return deferred.promise;
};



get("http://bro.jeremyosborne.com/api/echobro")
    .then(function(results) {
        console.log("Success:", results);
    }, function(err) {
        console.error("Error:", err);
    }, function(message) {
        console.info("Progress:", message);
    });



var prom = get("http://bro.jeremyosborne.com/api/notyourbro");
prom.done(function(results) {
    console.log("Success:", results);
});
prom.fail(function(err) {
    console.error("Error:", err);
});
prom.progress(function(message) {
    console.info("Progress:", message);
});
