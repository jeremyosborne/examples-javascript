var http = require('http');
var path = require("path");
var express = require("express");



var app = express();
app.use("/", express.static(path.join(__dirname, 'www')));

app.configure(function(){
    app.set('port', process.env.PORT || 4242);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'www')));
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

