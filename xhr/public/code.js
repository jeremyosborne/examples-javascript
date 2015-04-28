// AJAX originally stood for Asynchronous JavaScript And XML.
//
// There isn't an official "AJAX" object, library, plugin. It's a
// coding style and page design style that refers to dynamic updates
// to our page without a full page reload.
//
// This example takes a look at the XMLHttpRequest object, and if there was
// an official "AJAX" object, this is it.
window.onload = function() {
    var links = document.getElementsByTagName("a");
    var i;

    var showContents = function(xhr, e) {
        var preview;

        if (xhr.readyState == 4) {
            preview = document.createElement("div");
            preview.className = "preview-window";
            preview.innerHTML = xhr.responseText;
            preview.style.left = e.pageX + "px";
            preview.style.top = e.pageY + "px";
            document.body.appendChild(preview);
            setTimeout(function() {
                preview.parentNode.removeChild(preview);
            }, 3000);
        }
    };

    var makeRequest = function(href, e) {
        // if you must support old browsers, look for "xhr in ie6."
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            showContents(this, e);
        };
        xhr.open("GET", href, true);
        xhr.send(null);
    };

    for (i = 0; i < links.length; i++) {
        links[i].onclick = function(e) {
            e = e || window.event;
            e.returnValue = false;
            e.preventDefault();
            makeRequest(this.href, e);
        };
    }
};
