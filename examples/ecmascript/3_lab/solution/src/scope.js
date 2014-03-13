exports.blockscope = function() {
    var status = "status";
    var i;
    
    for (i = 0; i < 10; i++) {
        if (typeof i == "number") {
            break;
        }
    }

    return status;
};


