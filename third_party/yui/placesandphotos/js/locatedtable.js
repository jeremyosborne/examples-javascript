/**
 * Display a table of located places.
 * 
 * @module locatedtable
 */
YUI.add('locatedtable', function(Y) {

    // Caption template.
    var caption = Y.one("#located-table-caption-template").getHTML();
    caption = Y.Handlebars.compile(caption);

    // A list of the places we've found, and their locations.
    var table = new Y.DataTable({
        columns: [
            "name", 
            "latitude",
            "longitude"
        ],
        data: null,
    
        caption: "",
    
        sortable: true,
    
        summary: "What locations did we find?"
    });


    /**
     * Manage a datatable of locations.
     * @class Table
     * @namespace Located
     * @static
     */
    Y.namespace("Located").Table = {
        
        /**
         * Public access to the underlying datatable.
         * @property _table
         * @type DataTable
         */
        _table: table,
        
        /**
         * Pass through to underlying datatable render.
         * @method render
         * @param selector {String} CSS selector of where to render to.
         */
        render: function(selector) {
            table.render(selector);
        },
        
        /**
         * Update the datatable with new data.
         * @method update
         * @param [location="unknown"] {String} Which location do these
         * places correspond to?
         * @param [places] {Place[]} List of place objects with which to
         * update the table. Leave places empty to empty out the table.
         */
        update: function(location, places) {
            location = location || unknown;
            places = places || [];
            
            table.set("caption", caption({
                location: location,
                places: places
            }));
            // Location table.
            if (places.length) {
                table.set("data", places);
            }
            else {
                table.set("data", null);
            }
        }

    };

        
}, "0.0.1", { requires: ["datatable", "handlebars"] });
