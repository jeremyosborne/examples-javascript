/**
 * Find things in the world via YQL.
 * 
 * @module locatedsearch
 */
YUI.add("locatedsearch", function(Y) {
    /**
     * Find things in the world via YQL.
     * 
     * @class Search
     * @namespace Located
     * @static
     */

    /**
     * Find matches to a particular location name in the world, if possible.
     * 
     * @method locations
     * @param location {String} Location as a string.
     */
    Y.namespace("Located.Search").locations = function(location) {
        
        /**
         * Fired as search query is submitted to YQL.
         * @event locations-query-submitted 
         */
        Y.fire("locations-query-submitted");
        
        var query = "select * from geo.places where text='"+location+"'";
        Y.YQL(query, function(response) {        
            var i;
            var rawPlaces = [];
            var places = [];

            // Normalize the response so we always return an array of places.
            if (response.query.count) {
                // We have at least 1 result.
                if (1 == response.query.count) {
                    // Handle when we get back an object, not an array.
                    rawPlaces = [response.query.results.place];
                }
                else {
                    // This must be an array.
                    rawPlaces = response.query.results.place;                    
                }
            }
            // Normalize the objects.
            for (i = 0; i < rawPlaces.length; i++) {
                places.push( new Y.Located.Place(rawPlaces[i]) );
            }
                
            /**
             * Fired after search query has responded from YQL.
             * @event locations-query-responded
             * @param location {String} The location that was searched for.
             * @param places {Located.Place[]} List of place matches 
             * returned from YQL for this particular location.
             */
            Y.fire("locations-query-responded", {
                location: location,
                places: places
            });
        });
    };

    /**
     * Find any photos in a particular area.
     * 
     * @method photos
     * @param location {String} Human friendly description for where we are 
     * searching.
     * @param latitude {String|Number} Latitude of where to search for
     * photos.
     * @param longitude {String|Number} Longitude of where to search for
     * photos.
     */
    Y.namespace("Located.Search").photos = function(location, latitude, longitude) {
        
        /**
         * Fired as photo query is submitted to YQL.
         * @event photos-query-submitted 
         */
        Y.fire("photos-query-submitted");

        var query = [
            'select * from flickr.photos.search',
            'where api_key="d603eeba3b0eb45badcac352983d1b10"', 
            'and lat='+latitude,
            'and lon='+longitude,
        ].join(" ");
        
        Y.YQL(query, function(response) {        
            var i;
            var rawPhotos = [];
            var photos = [];

            // Normalize the response so we always return an array of places.
            if (response.query.count) {
                // We have at least 1 result.
                if (1 == response.query.count) {
                    // Handle when we get back an object, not an array.
                    rawPhotos = [response.query.results.photo];
                }
                else {
                    // This must be an array.
                    rawPhotos = response.query.results.photo;
                }
            }
            // Normalize the objects.
            for (i = 0; i < rawPhotos.length; i++) {
                photos.push( new Y.Located.Photo(rawPhotos[i]) );
            }
                        
            /**
             * Fired after photo query has responded from YQL.
             * @event photos-query-responded
             * @param location {String} The location that was searched for.
             * @param photos {Located.Photo[]} 
             */
            Y.fire("photos-query-responded", {
                location: location,
                photos: photos
            });
        });
    };
    
}, '0.0.1', {requires: ['yql', 'locatedplace'] });
