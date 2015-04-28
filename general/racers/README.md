Haven't messed with this in awhile. Here's my old notes for reference:

* racers/
    * Purpose: Thoughts that go into building and managing a full stack application.
    * Walkthrough: the Gruntfile and why some pieces are commented out.
    * Part 1: application logic is much easier to test than the DOM.
        * Build the graphicless logic parts so that they adhere to the tests, uncommenting the tests in the Gruntfile as we progress.
            * kung fu - src/utils.js
            * kung fu - src/mixins.js
            * kung fu - src/random.js
            * lab - src/racer.js
            * walkthrough - src/raceentry.js
            * walkthrough - src/racetrack.js
        * Kung fu: Build the simple simulation.
        * Run the simplesimulation and make sure things work.
    * Part 2: build the basic running application in the browser, which is pretty much just visual
            * walkthrough - www/index.html
            * kung fu - app.js (to serve the files)
            * walkthrough - polyfill.js
            * kung fu or lab (depends on class) - src/browserapp.js
            * walkthrough - src/handlebars_helpers.js (after out template breaks).
        * Have the race be animated with continued calls to the simulate method.
    * Part 3: server side templating
        * kung fu - app2.js db.create process + db.js (create, getRacers)
        * kung fu - app2.js render engine processs + handlebars_renderengine.js
        * walkthrough - templates/index2.hb
        * walkthrough - the templates and transpiled_templates and how they work
        * kung fu - Configuring express routes.
        * LAB: browserapp2.js
            * Copy over browserapp and configure to use with the transpiled templates.
            * Gruntfile modification: Switch to using the handlebars runtime: smaller version downloaded when we dist things.
            * Use the racecar datamodels that are bootstrapped into the page vs. generating the racecars.
    * Part 4: server side APIs
        * kung fu: simplesimulation3.js (the data saving part)
        * walkthrough: templates/index3.html IS NO DIFFERENT. I just changed the numbering scheme to make it not so jarring.
        * lab or kung fu: app3.js
            * Accept a post to the root path to update the raacer data.
        * lab: integrate with the server and update the stats.
            * Overview
                * Create a templates/standings.hb display for the stats as a template and transpile the template on the server, hooking it into the templates.
                * Display the stats after a game.
                * Save the stats to the server.
                * Once the stats have been saved, tell the user to refresh the browser and prove that it works.
            * browserapp3.js
                * Have the race scores be recorded, and stats on the drivers get saved on the server.
                * look for the TODOs
            * templates/standings-table.hb
                * build the standings-table as a handlebars template
                * make sure it is built as a template (Gruntfile)
                * add CSS to make the table modal.
                * Allow an element in the table to be updated with the server notification.
    * Part 5: cleanup
        * During a dist grunt, make the jshint items harder-core (mainly remove devel).
        * Talk about using the minified code.
