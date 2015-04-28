/*global Handlebars:false, require:false */
(function() {
    
    var Handlebars;
    try {
        Handlebars = window.Handlebars;
    }
    catch(e) {
        Handlebars = require("handlebars");
    }
    
    Handlebars.registerHelper('get', function(context, options) {
        return context.get(options.hash.data);
    });

})();
