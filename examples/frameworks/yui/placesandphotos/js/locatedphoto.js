/**
 * Simple model for photos returned from YQL/flickr photo search.
 * 
 * @module locatedphoto
 */
YUI.add("locatedphoto", function(Y) {

    // Template for the flickr url.
    var urlTemplate = Y.Lang.trim(
        Y.one("#located-photo-url-template").getHTML()
    );
    urlTemplate = Y.Handlebars.compile(urlTemplate);



    /**
     * Simple photo model as a factory method.
     * @class Photo
     * @constructor
     * @namespace Located
     * 
     * @param photo {Object} Raw photo data, assumed to be from YQL.
     */
    Y.namespace("Located").Photo = function(photo) {
        photo = photo || {};
        
        /**
         * Title of photo.
         * @property title
         * @type String
         * @default "N/A"
         */
        this.title = photo.title || "N/A";
        /**
         * URL of photo.
         * @property url
         * @type String
         */
        this.url = urlTemplate(photo);
        /**
         * id of photo.
         * @property id
         * @type String
         */
        this.id = photo.id;
    };
    
}, "0.0.1", { requires: ["handlebars"] });
