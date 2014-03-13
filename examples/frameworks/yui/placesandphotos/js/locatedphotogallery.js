/**
 * Gallery view of photos we are looking for.
 * 
 * @module locatedphotogallery
 */
YUI.add("locatedphotogallery", function(Y) {
    
    // {Function} Template generator.
    var galleryTemplate = Y.one("#located-photogallery-template").getHTML();
    galleryTemplate = Y.Handlebars.compile(galleryTemplate);

    // {EventSubscription[]} of event subscriptions for the swipe event, 
    // when and if the photo gallery is ever made up.
    var swipeSubscriptions;
    // How many pixels do we need to move to swipe?
    var MIN_SWIPE = 50;
    // X value of where we started to swipe?
    var swipeStart = 0;
    // What is the index of our currently shown image.
    var index = 0;
    // {Number} Will be set to the max index whenever the photogallery is
    // updated.
    var maxIndex;
    // {Boolean} Disable during a swipe.
    var swipeLock = false;


    /**
     * Gallery of any found photos.
     * @class PhotoGallery
     * @static
     * @namespace Located
     */
    Y.namespace("Located").PhotoGallery = {
        /**
         * Update the gallery with new images.
         * @method update
         * @param [location] {String} Location we are displaying photos for.
         * Leave empty to clear off the gallery.
         * @param [photos] {Located.Photo[]} List of photo objects with 
         * which to update.
         */
        update: function(location, photos) {
            Y.one("#gallery").empty().append(galleryTemplate({
                location: location,
                photos: photos
            }));
            // Reset indices.
            index = 0;
            maxIndex = Y.all("#gallery .photo-container").size() - 1;

            this.onswipe();
        },
        /**
         * Sets up a swipe event on our container if it does not exist.
         * Mouse friendly.
         * @method onswipe
         */
        onswipe: function() {
            var gallery = this;
            
            if (swipeSubscriptions) {
                // Already setup, nothing else to do.
                return;
            }
            
            swipeSubscriptions = [];
            // Prevent the annoying dragging of images within our gallery.
            swipeSubscriptions[0] = Y.one("#gallery").delegate("mousedown", function(e) {
                this.setAttribute("draggable", false);
                e.preventDefault();
            }, "img");
            
            swipeSubscriptions[1] = Y.one("#gallery").delegate("gesturemovestart", function(e) {
                if (swipeLock) {
                    // Already swiping, get out.
                    return;
                }
                                
                e.preventDefault();
                // Where did the swipe start.
                swipeStart = e.pageX;
                
                this.once("gesturemoveend", function(e) {
                    var swipeEnd = e.pageX,
                        swipeDelta = swipeStart - swipeEnd,
                        isSwipe = Math.abs(swipeStart - swipeEnd) > MIN_SWIPE; 
                    
                    // Swipe is done.
                    swipeLock = false;
                                        
                    if (isSwipe && swipeDelta > 0) {
                        Y.log("swipe left, attempt transition next");
                        gallery.next();
                    }
                    else if (isSwipe && swipeDelta < 0){
                        Y.log("swipe left, attempt transition previous");
                        gallery.prev();
                    }
                    else {
                        Y.log("not a swipe");
                    }
                });

            }, ".slideshow-container");
        },
        
        /**
         * Proceed to the next image if within index boundaries and
         * not currently swiping.
         * @method next
         */
        next: function() {
            var photo = Y.one(".photo-container");
            var transitionTo = (parseInt(photo.getStyle("margin-left"), 10) || 0) -
                photo.get("clientWidth");
                        
            if (index + 1 <= maxIndex) {
                Y.log("transition next");
                index += 1;
                swipeLock = true;
                photo.transition({
                    marginLeft: transitionTo+"px"
                }, function() {
                    // Done, unlock for next transition.
                    swipeLock = false;
                });
            }
            else {
                Y.log("at max index, no transition");
            }            

        },

        /**
         * Proceed to the previous image if within index boundaries and
         * not currently swiping.
         * @method prev
         */        
        prev: function() {
            var photo = Y.one(".photo-container");
            var transitionTo = (parseInt(photo.getStyle("margin-left"), 10) || 0) +
                photo.get("clientWidth");
            
            if (index - 1 >= 0) {
                Y.log("transition previous");
                index -= 1;
                swipeLock = true;
                photo.transition({
                    marginLeft: transitionTo+"px"
                }, function() {
                    // Done, unlock for next transition.
                    swipeLock = false;
                });
            }
            else {
                Y.log("at 0 index, no transition");
            }            
        },
        
        /**
         * Clear the photo gallery.
         * @method empty
         */
        empty: function() {
            var i;
            if (swipeSubscriptions) {
                for (i = 0; i < swipeSubscriptions.length; i++) {
                    swipeSubscriptions.detach();
                }
                swipeSubscriptions = null;
                Y.one("#gallery").empty();                
            }
        }
    };
    
}, "0.0.1", { requires: ['handlebars', 'node', 'transition', 'event-move'] });
