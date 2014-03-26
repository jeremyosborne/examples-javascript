/*global Handlebars:false, requestAnimationFrame:false*/
$(document).ready(function() {

    var Racer = window.racers.Racer;
    var RaceTrack = window.racers.RaceTrack;
    var randint = window.racers.randint;

    var raceCarTemplate = Handlebars.compile($("#race-entries-template").html());
    var raceTrack = new RaceTrack();

    
    console.log("Welcome spectators! It's time for the race of the century!");    
    // Enter the racers.
    (function() {
        var numRacers = 6;
        var i;
        var racer;
        
        for (i = 0; i < numRacers; i++) {
            racer = new Racer();
            racer.set("name", racer.get("name")+i);
            racer.set("number", i);
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

            now = (new Date()).getTime();            
            raceTrack.incrementRace(now - lastCallTime);
            lastCallTime = now;
            $("#racetrack").empty().append(raceCarTemplate(raceTrack));
        };    
        requestAnimationFrame(updateRace);    
    })();

});
