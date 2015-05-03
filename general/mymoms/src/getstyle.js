(function(exports) {



/**
 * Adapted from ppk and quirksmode article:
 * http://www.quirksmode.org/dom/getstyles.html
 * 
 * Recommend only using this functon on the most significant rules available.
 * It's probably a bad idea to check for "border". It seems to be an okay idea
 * to check for "border-bottom-color". It's a bad idea to check for "font".
 * It's an okay idea to check for "font-style" or "font-family".
 * @name getStyle
 * @param el {HTMLElement} Element on which we wish to check for a style.
 * @param styleProp {String} The style property name to look for. Can be either
 * JavaScriptese camelCase style names or can be the hyphenated-css-style of
 * the name.
 * @return {String} The value of the style property.
 */
exports.getStyle = function(el, styleProp) {
    var val = "",
        camelCase = /([A-Z])/g,
        hyphen = /(\-\w)/g;
    
    if (el.currentStyle) {
        // IE and Opera, style names are JavaScriptese (camel case).
        styleProp = styleProp.replace(hyphen, function(match) {
            return match[1].toUpperCase();
        });
        val = el.currentStyle[styleProp];
    }
    else if (window.getComputedStyle) {
        // Others, css rules must be hyphenated.
        styleProp = styleProp.replace(camelCase, function(match) {
            return "-" + match.toLowerCase();
        });
        val = getComputedStyle(el, null).getPropertyValue(styleProp);
    }
    return val;
};


    
})(this);
