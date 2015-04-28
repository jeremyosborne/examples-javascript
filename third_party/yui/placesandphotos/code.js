// Main application code.

// Require our own custom modules plus dependencies.
YUI({
    modules: {
        locatedmap: {
            fullpath: 'js/locatedmap.js',
            requires: ['handlebars']
        },
        locatedplace: {
            fullpath: 'js/locatedplace.js',
            requires: []
        },
        locatedsearch: {
            fullpath: 'js/locatedsearch.js',
            requires: ['yql', 'locatedplace', 'locatedphoto']
        },
        locatedtable: {
            fullpath: 'js/locatedtable.js',
            requires: ['datatable', 'handlebars']
        },
        locatedphoto: {
            fullpath: 'js/locatedphoto.js',
            requires: ['handlebars']
        },
        locatedphotogallery: {
            fullpath: 'js/locatedphotogallery.js',
            requires: ['handlebars']
        }
    }
}).use('node', 'locatedsearch', 'locatedmap', 'locatedtable', 'locatedphotogallery', function(Y) {



    // Initialize our map.
    Y.Located.Map.render("#map");
    // Have the map listen to events.
    Y.on("locations-query-responded", function(e) {
        Y.Located.Map.update(e.places);
    });


    
    // Initialize our table.
    Y.Located.Table.render("#location-list");
    Y.on("locations-query-responded", function(e) {
        var table = Y.Located.Table.update(e.location, e.places);
    });



    // Setup our form.
    var form = Y.one('form');
    form.on('submit', function(e) {
        var location = this.one('#location').get('value');
        var query;
                
        if (location) {
            // pass off to YQL to do the work.
            Y.Located.Search.locations(location);
        }
    });
    // Waiting for response....
    Y.on("locations-query-submitted", function(e) {
        form.all("input").setAttribute("disabled");
        form.one(".form-waiting").removeClass("hidden");
    });
    // ...got response, unlock for next query.
    Y.on("locations-query-responded", function(e) {
        form.all("input").removeAttribute("disabled");
        form.one(".form-waiting").addClass("hidden");
    });



    
    Y.on("find-photos-nearby", function(e) {
        Y.Located.Search.photos(e.location, e.latitude, e.longitude);
    });
    Y.on("locations-query-submitted", function(e) {
        Y.Located.PhotoGallery.empty();
    });
    Y.on("photos-query-responded", function(e) {
        Y.Located.PhotoGallery.update(e.location, e.photos);
    });

});
