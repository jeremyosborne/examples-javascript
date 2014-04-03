var express = require('express');
var path = require('path');

var app = express();

app.set('port', 8080);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var reagents = require("./data/reagents.json");
app.get('/reagents', function(req, res) {
    res.send(reagents);
});
var alchemy = require("./data/alchemy.json");
app.all('/alchemy', function(req, res) {
    var reagent = req.param("reagent");
    var potions = alchemy
        .filter(function(potion) {
            var matches = potion.reagents.filter(function(ingredient) {
                return ingredient.toLowerCase() === reagent.toLowerCase();
            });
            return matches.length > 0;
        })
        .map(function(potion) {
            return potion.name;
        });

    // Artificial delay to (hopefully) allow watching of view update.
    // Refresh browser to see delay as these requests might be cached.
    setTimeout(function() {
        res.send(potions);
    }, 500);
});

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


