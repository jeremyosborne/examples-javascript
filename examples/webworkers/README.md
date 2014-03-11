Assuming you have [Node.js](http://nodejs.org) installed:

    npm install
    node server

Open the browser to localhost:port.

Server acts as document server only. We need to serve the files in most browsers to get around security restrictions of the API (e.g. browsers can prevent the API from working when double clicking a file and opening it in the file:// protocol).

Web Workers recommended reading:

* http://www.html5rocks.com/en/tutorials/workers/basics/
* https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers

Credits in this example:

* [jsGameSoup](http://jsgamesoup.net/) for the [A*](http://jsgamesoup.net/jsdocs/symbols/AStar.html) algorithm.
