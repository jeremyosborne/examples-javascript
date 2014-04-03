var request = require('request');
var Q = require('q');
var cheerio = require('cheerio');

var Wordy = function() {};
Wordy.prototype = {
    words_on_a_webpage: function(url) {
        var deferred = Q.defer();
        this.get_web_page(url).then(function(content){
            var $ = cheerio.load(content);
            // Handle corner cases.
            var body = $("body");
            var text;
            if (!body.length) {
                deferred.reject(new Error("No body element."));
                return;
            }
            text = body.text();
            if (!text) {
                deferred.resolve(0);
            }
            else {
                deferred.resolve(text.split(/\s+/).length);
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    get_web_page: function(url) {
        var deferred = Q.defer();
        request(url, function(err, res, content) {
            if (err) {
                deferred.reject(new Error("Couldn't retrieve data."));
            }
            else {
                deferred.resolve(content);
            }
        });
        return deferred.promise;
    }
};

exports.Wordy = Wordy;
