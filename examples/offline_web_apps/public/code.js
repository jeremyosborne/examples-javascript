window.onload = function() {

    var img = document.querySelector("img"),
        imgToggle = false;

    document.body.addEventListener('click', function(e) {
        imgToggle = !imgToggle;

        // Toggle image online or offline if the page is cached.
        if (imgToggle) {
            img.src = "img/cardsuit_club.png";
        }
        else {
            img.src = "img/cardsuit_spade.png";
        }
    }, false);



    if (window.applicationCache) {
        if (window.applicationCache.status == 0) {
            // According to the spec:
            //
            //    status == 0 == UNCACHED
            //
            // we're not associated with any cache object, proceed as normal.
        }
        else {
            // We have a cache.
            // Only one of the following events will fire.

            // Fired after the first cache of the manifest.
            window.applicationCache.addEventListener('cached', function() {
                console.log("Page is cached.");
            }, false);

            // Fired after the first download of the manifest.
            window.applicationCache.addEventListener('noupdate', function() {
                console.log("No changes.");
            }, false);

            // Fired when there is a cache update ready.
            window.applicationCache.addEventListener('updateready', function() {
                var refresh = confirm("Your application has been updated. Refresh?");
                if (refresh) {
                    window.location.reload();
                }
            }, false);
        }
    }
    else {
        // No cache.
    }
};