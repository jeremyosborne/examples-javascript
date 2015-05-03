(function(exports) {



/**
 * Dynamically load a javascript file. Once file is loaded, execute a callback
 * function.
 * @example
 * &lt;script type="text/javascript" src="http://myurl.orelsewhere.com/loader.js"&rt;&lt;/script&rt;
 * &lt;script type="text/javascript"&rt;
 * loadScript("http://myurl.orelsewhere.com/app.js", function(){
 *     // This function will be called after the script is loaded.
 *     // If necessary, the app can be started from this callback.
 * });
 * &lt;/script&rt;
 * @param url {string} The full URL from where the javascript will be
 * retrieved.
 * @param [callback] {function} A function that will be called after the
 * JavaScript has been loaded and is made available on the page.
 */
exports.loadScript = function(url, callback) {

    var script = document.createElement("script");

    if (script.readyState){
        // IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    }
    else {
        // Other browsers
        script.onload = function(){
            callback();
        };
    }

    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};



})(this);