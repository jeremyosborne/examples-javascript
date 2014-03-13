
module.exports = (function() {
    var a = [];
    var i;
    
    for (i = 0; i < 5; i++) {
        a[i] = function() {
            return i;
        };
    }
    
    return a;
})();
