/**
 * Simple model for places returned from YQL/geo location search.
 * 
 * @module locatedplace
 */
YUI.add("locatedplace", function(Y) {
    /**
     * Simple place model as a factory method.
     * @class Place
     * @constructor
     * @namespace Located
     * 
     * @param place {Object} Raw place data, assumed to be from YQL.
     */
    Y.namespace("Located").Place = function(place) {
        place = place || {};
        
        /**
         * Designated name of place.
         * @property name
         * @type String
         * @default "N/A"
         */
        this.name = place.name || "N/A";
        /**
         * Center latitude of place.
         * @property latitude
         * @type Number
         * @default 0
         */
        this.latitude = place.centroid && place.centroid.latitude || 0;
        /**
         * Center longitude of place.
         * @property longitude
         * @type Number
         * @default 0
         */
        this.longitude = place.centroid && place.centroid.longitude || 0;
        /**
         * High lever container of place (e.g. state level).
         * @property admin1
         * @type String
         * @default "N/A"
         */
        this.admin1 = place.admin1 && place.admin1.content || "N/A";
        /**
         * Country container of place.
         * @property country
         * @type String
         * @default "N/A"
         */
        this.country = place.country && place.country.content || "N/A";
    };
    
}, "0.0.1", {});
