window.onload = function() {
    var makeClassRE = function(className) {
        return new RegExp("(^|\\s)"+className+"(\\s|$)");
    };
    var addClass = function(el, className) {
        var re = makeClassRE(className);

        if (re.test(el.className) == false) {
            if (el.className.length > 0) {
                el.className += " " + className;
            }
            else {
                el.className += className;
            }
        }
    };
    var removeClass = function(el, className) {
        var re = makeClassRE(className);

        el.className = el.className
            .replace(re, " ")
            .replace(/^\s+|\s+$/g,"");
    };



    var loadImage = function() {
        var url = document.getElementById("image"),
            loader = document.createElement("img");

        // Attempt to load the image by setting the src of our created image
        // element.
        loader.src = url.value;
        // Respond to the load event or the error event appropriately.
        loader.onload = function() {
            var container = document.getElementById("image-preview");
            var image = container.getElementsByTagName("img")[0];
            if (image) {
                image.parentNode.removeChild(image);
            }
            container.appendChild(this);

            removeClass(url, "invalid");
            removeClass(url.parentNode, "invalid");
        };
        loader.onerror = function() {
            addClass(url, "invalid");
            addClass(url.parentNode, "invalid");
        };
    };

    document.forms[0].onsubmit = function() {
        try {
            loadImage();
        }
        catch(e) {
            console.log(e);
        }

        return false;
    };
};


