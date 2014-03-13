/**
 * Display locations in the world on a map.
 * 
 * @module locatedmap
 */
YUI.add("locatedmap", function(Y) {
            
    // --- Private items.
    // Our map object. This module can handle one per page.
    var map;
    // List of any markers in the view.
    var markers = [];
    // Handlebars template for marker popup.
    var markerPopupTemplate = Y.one("#located-popup-template").getHTML();
    markerPopupTemplate = Y.Handlebars.compile(markerPopupTemplate);
    

    /**
     * Show a map of the world with basic location markers.
     * Visual maps provided by:
     * 
     * * [Leaflet.js](http://leafletjs.com) for the JS API 
     * * [OpenStreetMap](http://www.openstreetmap.org/) for the data data.
     *
     * @class Map
     * @namespace Located
     * @static
     */
    Y.namespace("Located").Map = {

        /**
         * Render a map.
         * @method render
         * @param selector {String} CSS selector of 
         */
        render: function(selector) {
            // Leaflet needs a DOM node, not a YUI Node.
            map = L.map( Y.one(selector).getDOMNode() ).setView([0, 0], 1);
            // The webservice that displays the tiles.
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            }).addTo(map);
        },
        
        /**
         * Update the map with new markers.
         * @method update
         * @param [places] {Place[]} List of place objects with which to
         * update. Leave places empty to clear off the map.
         */
        update: function(places) {
            var i;
            places = places || [];
            
            // Always clear off the markers.
            this.clearMarkers();
            
            // Add a marker for each location we've found.
            for (i = 0; i < places.length; i++) {
                this.addMarker(places[i]);
            }
        },
        
        /**
         * Clear all markers from the map.
         * @method clearMarkers
         */
        clearMarkers: function() {
            var i;
    
            if (!map) {
                Y.log("attempt to call clearMarkers on non-existant map.");
                return;
            }
            
            for (i = 0; i < markers.length; i++) {
                map.removeLayer(markers[i]);
            }
            markers = [];
        },
    
        /**
         * Add a marker to the map.
         * @method addMarker
         * @param place {Object} 
         */
        addMarker: function(place) {
            var marker;
            var popup;
            
            if (!map) {
                Y.log("attempt to call addMarker on non-existant map.");
                return;
            }

            // Leaflet naively stops propagation in their code.
            // We setup our popup content to listen for it's click and
            // publish an event.
            popup = Y.Node.create(markerPopupTemplate(place));
            popup.delegate("click", function(e) {
                /**
                 * Fired after a click on a "Find Photos Nearby".
                 * @event find-photos-nearby
                 * @param location {String} Human friendly name of the 
                 * location to search for photos at.
                 * @param latitude {Number} Latitude of search point.
                 * @param longitude {Number} Longitude of search point.
                 */
                Y.fire("find-photos-nearby", {
                    location: Y.Lang.trim(this.ancestor()
                        .one(".located-popup-name")
                        .getHTML()),
                    latitude: parseFloat(this.getData("latitude")),
                    longitude: parseFloat(this.getData("longitude"))
                });
            }, ".search-for-photos");
            
            // Place the marker on the map.
            marker = L.marker([place.latitude, place.longitude])
                // We use the Node above to manage the event, but
                // we pass the DOM node to leaflet to add to the page.
                .bindPopup(popup.getDOMNode())
                .addTo(map);
            
            // Keep a reference to our marker so it can be removed.
            markers.push(marker);
        }
        
    };

}, "0.0.1", { requires: ["handlebars"] });
