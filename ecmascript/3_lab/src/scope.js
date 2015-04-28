exports.blockscope = function() {
    var i = "status";
    
    for (var i = 0; i < 10; i++) {
        if (typeof i == "number") {
            break;
        }
    }

    return i;
};


