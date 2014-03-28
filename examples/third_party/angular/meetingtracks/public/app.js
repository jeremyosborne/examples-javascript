var app = angular.module('app', [
    'ui.router',
    'jmdobry.angular-cache',
    'ui.bootstrap',
    'ngAnimate'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/meetings");
    var breadcrumbConfig = {
        templateUrl: "templates/breadcrumbs.html",
        controller: "breadcrumbController"
    };
    var headerConfig = {
        templateUrl: "templates/header.html",
        controller: "headerController",
    };

    $stateProvider.state('meetings', {
        url: "/meetings",
        views: {
            '': {
                templateUrl: "templates/meetings.html",
                controller: "meetingsController",
            },
            'breadcrumbs@': breadcrumbConfig,
            'header@': headerConfig
        }
    }).state('meetings.meeting', {
        url: "/{meetingId}",
        views: {
            '': {
                templateUrl: "templates/meeting.html",
                controller: "meetingController"
            },
            'breadcrumbs@': breadcrumbConfig,
            'header@': headerConfig
        }
    }).state('meetings.meeting.session', {
        url: '/{sessionId}',
        views: {
            '': {
                templateUrl: "templates/session.html",
                controller: "sessionController"
            },
            'breadcrumbs@': breadcrumbConfig,
            'header@': headerConfig
        }
    });
});

app.service('meetingsService', function ($http, $q, $angularCacheFactory) {
    var _dataCache = $angularCacheFactory('meetingsCache', {
        maxAge: 10000
    });

    var refreshData = function(promise) {
        $http.get("/meetingdata.json")
            .success(function(data) {
                _dataCache.put("meetings", data.meetings);
                promise.resolve(data.meetings);
            })
            .error(function() {
                console.log("Error retrieving meeting data.");
                promise.reject(new Error("Error retrieving meeting data."));
            });
    };

    return {
        get: function() {
            var deferred = $q.defer();
            if (_dataCache.get("meetings")) {
                deferred.resolve(_dataCache.get("meetings"));
            }
            else {
                refreshData(deferred);
            }
            return deferred.promise;
        }
    };
});

app.service('meetingService', function ($http, $q, $angularCacheFactory, meetingsService) {
    var _dataCache = $angularCacheFactory('meetingCache', {
        maxAge: 10000
    });

    var indexMeetings = function(meetings) {
        meetings.forEach(function(meeting) {
            _dataCache.put(""+meeting.id, meeting);
        });
    };

    return {
        getById: function(id) {
            var deferred = $q.defer();
            if (_dataCache.get(id)) {
                deferred.resolve(_dataCache.get(id));
            }
            else {
                meetingsService.get().then(function(meetings) {
                    indexMeetings(meetings);
                    deferred.resolve(_dataCache.get(id));
                }, function() {
                    console.error("Ooops, error in getById");
                    deferred.reject(new Error("Ooops, error in getById"));
                });
            }
            return deferred.promise;
        }
    };

});

app.controller("meetingsController", function ($scope, meetingsService) {
    meetingsService.get()
        .then(function(meetings) {
            $scope.meetings = meetings;
        }, function(err) {
            console.log(err);
        });
});

app.controller("meetingController", function($scope, $stateParams, meetingService) {
    meetingService.getById($stateParams.meetingId)
        .then(function(meeting){
            $scope.meeting = meeting;
        }, function(err) {
            console.log(err);
        });
});

app.controller("headerController", function($scope, $stateParams) {
    if ($stateParams.sessionId) {
        $scope.header = "Session Info";
    }
    else if ($stateParams.meetingId) {
        $scope.header = "Meeting Info";
    }
    else {
        $scope.header = "Meetings Available";
    }
});

app.controller("breadcrumbController", function($scope, $stateParams) {
    var generic = [
        // Nothing for the default
        {href: "#/meetings", title: "Meetings"}
    ];
    var crumbs = generic.slice();
    if ($stateParams.meetingId) {
        crumbs.push({
            href: "#/meetings/"+$stateParams.meetingId,
            title: $stateParams.meetingId
        });
    }
    if ($stateParams.sessionId) {
        crumbs.push({
            href: "#/meetings/"+$stateParams.meetingId+"/"+$stateParams.sessionId,
            title: $stateParams.sessionId
        });
    }
    $scope.crumbs = crumbs;
});

app.controller("sessionController", function($scope, $stateParams, meetingService) {
    // Fix...
    meetingService.getById($stateParams.meetingId)
        .then(function(meeting){
            var i, item, sessions = meeting.sessions;
            for (i = 0; i < sessions.length; i++) {
                if (sessions[i].id == $stateParams.sessionId) {
                    $scope.session = sessions[i];
                    console.log($scope.session);
                    break;
                }
            }
        }, function(err) {
            console.log(err);
        });
});




