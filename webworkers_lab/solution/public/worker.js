var counter = function() {
    for (var i = 0; i < 1e10; i++) {
        if (i % 1e9 == 0) {
            postMessage("Count at: " + i);
        }
    }
    
    postMessage("Counting done.");
};

onmessage = function(event) {
    var i;
    
    if (event.data == "count") {
        counter();
    }
    else {
        postMessage("Nothing to do.");
    }
};
