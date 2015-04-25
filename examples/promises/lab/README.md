* Wrap the XMLHttpRequest object as a Q based promise (Q.defer).
* Your function `get` will make simple HTTP GET requests and will take a single URL as an argument.
* `get` will return a deferred based promise.
* If execution is successful, the promise will be resolved with the responseText. Success is determined by a status code of 200 in the xhr.
* If execution fails, the promise will be rejected with a message containing the xhr status code.
* For every readystate that is not the done state, notify the user with some message in regards to waiting... and the readystate.
* Test this out with the following URLs, one that should work, and one that will fail:

        http://bro.jeremyosborne.com/api/echobro

        http://bro.jeremyosborne.com/api/notyourbro
