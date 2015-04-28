var express = require("express");

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));



var PORT = 3000;
app.listen(PORT, function() {
    console.log("app is running on port %s.", PORT);
});
