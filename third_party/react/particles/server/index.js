/* eslint no-console: 0 */

var express = require("express");
var path = require("path");
// var reload = require("reload");
var webpack = require("webpack");

var ROOT_PATH = path.resolve(__dirname, "..");

var app = express();
app.use(express.static(path.join(ROOT_PATH, "/public")));

var PORT = 3000;

if (process.env.NODE_ENV !== "production") {
    console.info("Developer server serving.");

    // Build assets then start server.
    //
    // Add an intercept for asset requests that allows building on the fly and
    // reloading the browser page on changed files.
    // Step 1: Create & configure a webpack compiler
    var webpackConfig = require(path.resolve(__dirname, "../.webpack.config"));
    webpack(webpackConfig, function(err, status) {
        if (err) {
            console.error("Webpack asset build had a problem:", err);
        } else {
            // Assets built, run the server.
            console.info("Webpack assets built.");

            // Browser reload, see:
            // see: https://www.npmjs.com/package/reload
            // Was not able to get this working without an explicit delay and `wait`.
            // reload(server, app, 300, true);

            app.listen(PORT);
        }
    });
} else {
    app.listen(PORT);
}
