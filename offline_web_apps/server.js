var http = require("http");
var express = require('express');
var app = express();



// Change if you want a different port.
app.set("port", 8080);
// Document root has some smarts, like serving index.html to root path.
app.use('/', express.static(__dirname + '/public'));

http.createServer(app).listen(app.get("port"), function() {
    console.log("server listening on:", app.get("port"));
});
