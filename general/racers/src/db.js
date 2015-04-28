var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(':memory:');

module.exports = {
    
    create: function(done) {
        db.serialize(function() {
            var i, stmt;
            var colors = [
                "orange",
                "yellow",
                "green",
                "blue",
                "indigo",
                "violet",
                "cyan",
                "magenta",
            ];
        
            db.run("CREATE TABLE racer (" +
                [
                    "name TEXT default 'Hanz'", 
                    "carColor TEXT default 'red'", 
                    "speed REAL default 0.1", 
                    "number INTEGER default 1", 
                    "wins INTEGER default 0", 
                    "losses INTEGER default 0",
                ].join(", ") +
                ")"
            );
                
            // Create our dummy racers.
            stmt = db.prepare("INSERT INTO racer (name, carColor, number) VALUES (?, ?, ?)");
            for (i = 0; i < 10; i++) {
                stmt.run("Hanz " + i, colors.pop() || "red", i);
            }
            stmt.finalize(function(err) {
                done(err);
            });
        });
    },
    
    getRacers: function(done) {
        var racers = [];
        db.each("SELECT * from racer", function(err, racer) {
            if (err) {
                console.error(err);
            }
            else {
                racers.push(racer);
            }
        }, function(err, count) {
            done(err, racers);
        });
    },
    
    updateRacerStats: function(data, done) {
        db.serialize(function() {
            var stmt = db.prepare("UPDATE racer SET wins=?, losses=? WHERE name=?");
            var i;
            for (i = 0; i < data.length; i++) {
                stmt.run(data[i].wins, data[i].losses, data[i].name);
            }
            stmt.finalize(function(err) {
                done(err);
            });
        });
    },
    
    close: function() {
        db.close();
    },
};
 

