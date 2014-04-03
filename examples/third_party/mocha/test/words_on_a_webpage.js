var Wordy = require("../src/words_on_a_webpage").Wordy;
var assert = require("assert");
var Q = require("q");

suite('words_on_a_webpage', function(){
    suite('output of complete webpage', function() {
        var w;
        setup(function() {
            w = new Wordy();
            w.get_web_page = function() {
                var deferred = Q.defer();
                setTimeout(function() {
                    var content = [
                        "<body><p>hello world! how are you?</p>",
                        "<p>what's <b>up?</b></hr></p></body>"
                    ].join("\n");
                    deferred.resolve(content);
                }, 1);
                return deferred.promise;
            };
        });
        test('should return the count of the number of words in the body', function(done) {
            w.words_on_a_webpage("http://test.com").then(function(count) {
                done(count == 7 ? undefined : new Error());
            }, function() {});
        });
    });

    suite('output of empty webpage', function() {
        var w;
        setup(function() {
            w = new Wordy();
            w.get_web_page = function() {
                var deferred = Q.defer();
                setTimeout(function() {
                    deferred.resolve("<body></body>");
                }, 1);
                return deferred.promise;
            };
        });
        test('should return 0', function(done) {
            w.words_on_a_webpage("http://test.com").then(function(count) {
                done(count === 0 ? undefined : new Error());
            });
        });
    });

    suite('exceptional situations', function() {
        var w;
        setup(function() {
            w = new Wordy();
            w.get_web_page = function() {
                var deferred = Q.defer();
                setTimeout(function() {
                    deferred.resolve('{"test":42}');
                }, 1);
                return deferred.promise;
            };
        });
        test('should raise an error if the webpage cannot be parsed as html', function(done) {
            w.words_on_a_webpage("http://test.com").then(function() {
                }, function(err) {
                    done(err instanceof Error ? null : "Something bad didn't happen, and it should have");
                });
        });
    });


    suite('exceptional situations', function() {
        var w;
        setup(function() {
            w = new Wordy();
            w.get_web_page = function() {
                var deferred = Q.defer();
                setTimeout(function() {
                    deferred.reject(new Error("Cannot find web page."));
                }, 1);
                return deferred.promise;
            };
        });
        test('should raise a an error if the webpage cannot be accessed', function(done) {
            w.words_on_a_webpage("http://test.com").then(function() {
                }, function(err) {
                    done(err instanceof Error ? null : "Something bad didn't happen, and it should have");
                });
        });
    });
});
