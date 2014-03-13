exports.delay = function(cb) {
    var start = Date.now();
    setTimeout(function() {
        cb(Date.now() - start);
    }, 10);
};
