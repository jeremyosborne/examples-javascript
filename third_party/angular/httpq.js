// Queue up HTTP requests.
// Include the httpq module and inject the httpq factory where needed.
// Pass request descriptors to .send().
// Change the number of HTTP requests allowed in flight at a time
// with maxFlights().
angular.module("httpq", []).factory("httpq", function($http) {
	var maxFlights = 3;
	var inFlight = 0;
	var q = [];

	return {
        // Acts as getter and setter.
        maxFlights: function(num) {
            if (num) {
                maxFlights = num;
            } else {
                return maxFlights;
            }
        },
		// All requests are made with $http(opts). Pass all opts in one package.
		// callback is passed to both success and error.
		send: function(opts, callback) {
			q.push({opts: opts, callback: callback});
			this._send();
		},
		// Determines whether or not something should be sent.
		_send: function() {
			var self = this;
			if (inFlight < maxFlights && q.length > 0) {
				var next = q.shift();
				inFlight++;
				$http(next.opts).success(function() {
					inFlight--;
					self._send();
					next.callback.apply(null, arguments);
				}).error(function() {
					inFlight--;
					self._send();
					next.callback.apply(null, arguments);
				});
			}
		}
	};
});
