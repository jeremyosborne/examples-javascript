


// Include Angular router module.
var app = angular.module('app', ['ngRoute']);

// Setup router.
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl : 'templates/no-image.html',
        controller: "RouteController"
    });
    $routeProvider.when('/imgproxy', {
        templateUrl : 'templates/with-image.html',
        controller: "RouteController"
    });

    // Web session API. Breaks older browsers.
    $locationProvider.html5Mode(true);
});

app.controller("RouteController", function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    console.log($routeParams);
});

// Singleton, same data for all consumers.
app.factory('urlFactory', function($http) {
    // Manage our data with a more authentic "model".
    var urls = [];

    var update = function(l2) {
        var i;
        // Keep original list in memory in reference.
        for (i = 0; i < urls.length; i++) {
            urls.pop();
        }
        for (i = 0; i < l2.length; i++) {
            urls.push({
                // Web service specific naming.
                name: l2[i].split("=")[1],
                // Make a friendly query string param.
                encoded: encodeURIComponent(l2[i])
            });
        }
    };

    $http.get('http://bro.jeremyosborne.com/api/imgbro')
        .success(function(data, status, headers, config) {
            console.log("Data retrieved:", data);
            // Convert and make available to scope via our model.
            update(data.urls);
        })
        .error(function(data, status, headers, config) {
            console.log("Something bad happened:", data);
        });

    // Expose the data. Model manages itself, whenever it updates, page
    // updates.
    return {
        urls: urls
    };
});

app.controller("ImageController", function ($scope, urlFactory) {
    // Point scope to the urls. Controller done.
    $scope.urls = urlFactory.urls;
});
