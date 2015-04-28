# Lab: Web Workers

Serve the files in `public/`. Some ways to single line serve the files:

node

    npm install -g node-static
    static -p 8000 public

[Other single line web servers](https://gist.github.com/willurd/5720255).

* in `public/code.js`
    * make a web worker from `worker.js`
    * start the counting when the user submits the "#counter" form
    * when the worker submits a message back that updates the count, add messages to the #results element

* in `public/worker.js`
    * listens for a `count` message
    * when receiving a `count` message, begins counting to 10 billion
    * every 1 billion, have the worker post a message back to the web page
    * when done counting, send a done message back

