# Lab: Web Workers

Assuming you have [Node.js](http://nodejs.org) installed:

    npm install
    node server

Open the browser to localhost:port.

* in `public/code.js`
    * make a web worker from `worker.js`
    * start the counting when the user submits the "#counter" form
    * when the worker submits a message back that updates the count, add messages to the #results element

* in `public/worker.js`
    * listens for a `count` message
    * when receiving a `count` message, begins counting to 10 billion
    * every 1 billion, have the worker post a message back to the web page
    * when done counting, send a done message back

