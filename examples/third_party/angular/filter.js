angular.module("filters", [])
// Attempts to be a sane length checker, returns integer.
.filter("len", function() {
    return function(item) {
        if (item && item.length) {
            return item.length;
        }
        try {
            // Saw this used to strip angular specific things off angular objects.
            return Object.keys(angular.copy(item)).length;
        } catch(e) {
            return 0;
        }
    };
});
