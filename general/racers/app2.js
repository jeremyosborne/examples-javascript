var fs = require("fs");
var http = require('http');
var path = require("path");
var async = require("async");
var express = require("express");
var Handlebars = require("handlebars");
var db = require("./src/db");


var app = express();
async.series([

    function(processdone) {
        console.log("Initializing Database...");
        
        db.create(function() {
            console.log("Database initialized correctly.");
            processdone(null);
        });
    },

    function(processdone) {
        console.log("Configuring express render engine...");
        
        app.set('views', __dirname + '/templates');
        app.set('view engine', 'handlebars');
        app.engine('hb', require('./src/handlebars_renderengine'));
    
        processdone(null);
    },
    
    function(processdone) {
        var partialPaths = [
            "transpiled_templates/TEMPLATES.js",
        ];
        var i;
        
        console.log("Registering handlebars partials for client side use...");

        async.map(partialPaths, function(p, registerPartialDone) {            
            fs.readFile(p, "UTF-8", function(err, contents) {
                var partialName = path.basename(p, path.extname(p));
                console.log("Registering partial name:", partialName, "from file:", p);
                Handlebars.registerPartial(
                    partialName,
                    contents
                );
                registerPartialDone(err);
            });
        }, function(err, results){            
            // Pass the error on if there is one.
            if (err) {
                console.error(err);
            }
            processdone(err);
        });
    },
    
    function(processdone) {
        console.log("Configuring express app...");

        app.configure(function(){
            app.set('port', process.env.PORT || 4242);
            app.use(express.favicon());
            app.use(express.logger('dev'));
        });

        processdone(null);
    },
    
    function(processdone) {
        console.log("Configuring express routes...");
        
        app.get('/', function(req, res) {
            db.getRacers(function(err, data) {
                if (err) {
                    console.error("problem with db.getRacers:", err);
                    // continue in this case, if we can...
                }
                res.render('index2.hb', {racers: JSON.stringify(data)});
            });
        });
        app.use(express.static(path.join(__dirname, 'www')));
        
        processdone(null);
    },
    
],
function(err, results) {
    var server;
    var cleanup = function () {
        console.log("Closing out connections and database.");
        server.close();
        db.close();
        process.exit();
    };

    if (err) {
        console.error("Can't start express app:");
        console.error(err);
        return;
    }
    
    
    console.log("Express server listening on port " + app.get('port'));
    server = app.listen(app.get('port'));
    process.on('SIGTERM', cleanup)
        .on('SIGINT', cleanup);
});



