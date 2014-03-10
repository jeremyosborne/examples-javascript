[Offline web applications](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html) is a browser functionality, but it needs a server to operate. We use [Node.js](http://nodejs.org) for the example:

To run:

    npm install
    node server

* Navigate to localhost in a browser.
* Recommend Chrome as the test browser and recommend opening the debug console to watch how application cache works.
* Refresh the page a couple of times.
* Change the manifest.appcache file (something benign, like the version line).
* Refresh the browser with the server running.
* After successful storage of assets (as can be seen in the console), turn off the server and reload the page.



Recommended reading:

* http://alistapart.com/article/application-cache-is-a-douchebag
* http://appcachefacts.info
* https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache
