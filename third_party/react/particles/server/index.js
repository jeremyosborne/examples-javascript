/* eslint no-console: 0 */

var express = require("express");
var path = require("path");

var ROOT_PATH = path.resolve(__dirname, "..");

var app = express();
app.use(express.static(path.join(ROOT_PATH, "/public")));

var PORT = 3000;
app.listen(PORT, function() {
    console.log("app is running on port %s.", PORT);
});
