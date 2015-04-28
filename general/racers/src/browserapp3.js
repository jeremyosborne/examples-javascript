/*global Handlebars:false, requestAnimationFrame:false, TEMPLATES:false, DATA_BOOTSTRAP:false*/
$(document).ready(function() {

    var Racer = window.racers.Racer;
    var RaceTrack = window.racers.RaceTrack;
    var randint = window.racers.randint;

    var standingsTemplate = TEMPLATES["standings"];

    var raceCarTemplate = TEMPLATES["race-entries"];
    var raceTrack = new RaceTrack();
    
    var racers = DATA_BOOTSTRAP.racers;
    
    console.log("Welcome spectators! It's time for the race of the century!");    
    // Enter the racers.
    (function() {
        var numRacers = 6;
        var i;
        var racer;
        
        for (i = 0; i < numRacers; i++) {
            racer = new Racer(racers[i]);
            console.log("%s has entered the race!", racer.get("name"));
            raceTrack.addEntry({
                racer: racer,
            });
        }
    })();

    // Run the race.
    (function() {
        console.log("Racers get ready!");
        
        // Initialize track conditions.
        raceTrack.applyVariance();
        
        console.log("Ready... set... go!");
    })();

    (function() {
        var lastCallTime = new Date().getTime();

        var updateRace = function() {
            var now; 

            if (raceTrack.stillRacing()) {
                requestAnimationFrame(updateRace);
            }
            else {
                console.log("We're done! Stats...");
                raceStatistics();
            }

            now = (new Date()).getTime();            
            raceTrack.incrementRace(now - lastCallTime);
            lastCallTime = now;
            $("#racetrack").empty().append(raceCarTemplate(raceTrack));
        };    
        requestAnimationFrame(updateRace);    
    })();
    
    var raceStatistics = function() {
        var i;
        var racerData = [];
        var standings;
        
        raceTrack.updateStats();
        standings = raceTrack.standings();
        
        $("body").append(standingsTemplate({
            // Is okay with RaceEntry objects.
            raceEntries: standings
        }));        
        
        $(".standings .notification").html("Saving, please wait.");

        for (i = 0; i < standings.length; i++) {
            racerData.push(standings[i].racer.toJSON());
        }
        // The update needs Racer data objects.
        $.ajax("/", {
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(racerData)
        }).done(function(data) {
            if (!data.error) {
                $(".standings .notification").html("Done saving, refresh for more.");
            }
            else {
                $(".standings .notification").html("Error: "+data.message);                
            }
        }).fail(function(data) {
            $(".standings .notification").html("Error: "+data.message);                
        });
    };
    
});
