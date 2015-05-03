(function(exports){

/**
 * @namespace A collection of cookie functions, suitable for use within the
 * browser environment. 
 * @name cookie
 */
var cookie = {};

/**
 * Writes a cookie to disk.
 * Some numbers to note:
 * There should be no more than 50 cookies stored on disk.
 * IE imposes a 4k total storage limit, other browsers impose a 4k per cookie
 * size limit.
 * @param name {string} The identification, or key, of this particular
 * cookie.
 * @param [value] {string} The string value associated with this cookie.
 * If no value is supplied, the cookie key will be stored with an empty
 * value.
 * @param [days] {number} The number of days from now to expire the
 * cookie. If no value is supplied, the cookie will be written but expire
 * when the user closes the browser.
 */
cookie.write = function(name, value, days) {
    // Implement the following optional cookie fields
    // domain=.example.net;
    // HttpOnly
    // Example complete cookie (from wikipedia):
    // RMID=732423sdfs73242; expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; domain=.example.net; secure; HttpOnly
    var expires = "",
        date;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
};

/**
 * Searches for a cookie stored on disk and if it exists, returns the
 * value of the cookie.
 * @param {string} name required The cookie key to search for.
 * @returns {string} The value of an existing cookie is returned. If the
 * cookie does not exist undefined is returned.
 */
cookie.read = function(name) {
    var cookies = document.cookie.split('; '),
        numCookies = cookies.length,
        i,
        splitIndex,
        cookie,
        cookieName,
        cookieValue;

    for (i = 0; i < numCookies; i++) {
        // Index of the first equals sign.
        cookie = cookies[i];
        splitIndex = cookie.indexOf("=");
        cookieName = cookie.substr(0, splitIndex);
        cookieValue = cookie.substr(splitIndex+1);
        if (cookieName == name) {
            return cookieValue;
        }
    }
    return undefined;
};

/**
 * Finds a named cookie on disk and deletes it.
 * @param {string} name required The cookie key to erase. Supplying a cookie
 * name that doesn't exist won't cause any harm.
 */
cookie.erase = function(name) {
    cookie.write(name, "", -1);
};

// export
this.cookie = cookie;

})(this);
