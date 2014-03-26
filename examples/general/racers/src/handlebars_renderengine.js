var fs = require("fs");
var Handlebars = require("handlebars");
var templateCache = {};

module.exports = function(path, content, callback) {
    fs.readFile(path, 'utf8', function(err, template){
        if (err) {
            return callback(err, null);
        }
        else if (!templateCache[path]) {
            templateCache[path] = Handlebars.compile(template);
        }
        callback(null, templateCache[path](content));
    });
};
