window.onload = function() {

    // Mapping API.
    // Not the Geolocation API.
    var map = function(lat, lon, accuracy) {
        var map = new OpenLayers.Map("map");
        map.addLayer(new OpenLayers.Layer.OSM());
        var lonLat = new OpenLayers.LonLat(lon, lat)
                .transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                );
        var zoom = 16;

        var circleLayer = new OpenLayers.Layer.Vector("Circle Layer");
        var accuracyCenter = new OpenLayers.Geometry.Point(lonLat.lon,lonLat.lat);
        var accuracyPoly = OpenLayers.Geometry.Polygon
            .createRegularPolygon(accuracyCenter,
                accuracy, 50, 0);
        var accuracyStyle = {
                strokeColor: "#00ff00",
                fillColor: "#00ff00",
                fillOpacity: 0.4,
                strokeWidth: 3,
                strokeDashstyle: "solid"
            };
        var redcircleFeature = new OpenLayers.Feature
            .Vector(accuracyPoly, null, accuracyStyle);
        circleLayer.addFeatures([redcircleFeature]);
        map.addLayer(circleLayer);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));


        map.setCenter(lonLat, zoom);
    };



    //----------------------------------------- Begin Geolocation API.

    var positionTemplate = document.querySelector("#position-template").text;
    positionTemplate = Handlebars.compile(positionTemplate);

    // Convert the timestamp returned in the position object.
    Handlebars.registerHelper("toLocaleString", function(timestamp) {
        return (new Date(timestamp)).toLocaleString();
    });

    // Unlikely nowadays, but I left this in.
    if (!navigator.geolocation) {
        alert("Sorry, no geolocation object.");
        return;
    }

    // Find the position of the device as best as possible.
    navigator.geolocation.getCurrentPosition(
        // Success callback.
        function(position) {
            // Position object has implemented and non-implemented properties.
            console.log("Success. Position object output for inspection:");
            console.log(position);

            // Pass the position object as is to template.
            document.querySelector("#loc").innerHTML = positionTemplate(position);

            // Mapping is not part of the geolocation API.
            // To get a map, we make use of a third party.
            map(position.coords.latitude,
                position.coords.longitude,
                position.coords.accuracy);
        },
        // Failure callback.
        function(err) {
            switch (err.code) {
                case 1:
                    console.error("Permission denied.");
                    break;
                case 2:
                    console.error("Position unavailable.");
                    break;
                case 3:
                    console.error("Geolocation timeout.");
                    break;
                default:
                    console.error("Unexpected error:", err.code);
                    break;
                console.error("More error info:", err.message);
            }
        },
        // Optional options object.
        {
            // Potentially take a bit longer to get a better reading.
            "enableHighAccuracy": true,
            // Number of milliseconds before timing out.
            "timeout": 30000,
            // Number of milliseconds to cache previous successful request.
            "maximumAge": 1000
        }
    );


};
