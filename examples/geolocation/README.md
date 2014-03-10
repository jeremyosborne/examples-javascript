Assuming you have [Node.js](http://nodejs.org) installed:

    npm install
    node server

Open the browser to localhost:port.

Server acts as document server only. We need to serve the files in most browsers to get around security restrictions of the geolocation API (e.g. browsers usually prevent the geolocation API from working when double clicking a file and opening it in the file:// protocol).
