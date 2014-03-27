


// Include Angular router module.
var app = angular.module('app', ['ngRoute']);

// Setup router.
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl : '/templates/login.html',
        controller: "loginController"
    });
    $routeProvider.when('/chat', {
        templateUrl : '/templates/chatroom.html',
        controller: "chatController"
    });
    // Where to go when we get something else.
    $routeProvider.otherwise({
        redirectTo: '/'
    });

    // Web session API. Breaks older browsers.
    $locationProvider.html5Mode(true);
});

app.factory('userModel', function($http) {
    // Practice only.
    var VALID_PASS = "password";
    var user = {
        profile: {
            name: "",
            password: "",
            // Fake it with a time in the future.
            session: 0
        },
        isValid: function() {
            // Checking validity always wipes the password.
            if (this.isValidSession() || this.isValidLogin()) {
                return true;
            }
            else {
                return false;
            }
        },
        isValidLogin: function() {
            var password = this.profile.password;
            this.profile.password = "";
            if (this.profile.name && password == VALID_PASS) {
                // Set session to one hour from now.
                this.profile.session = Date.now() + (1000*60*60);
                // Here is the only place we save.
                this.save();
                return true;
            }
            return false;
        },
        isValidSession: function() {
            if (Date.now() < this.profile.session) {
                return true;
            }
            else {
                return false;
            }
        },
        save: function() {
            try {
                localStorage.profile = JSON.stringify(user.profile);
            }
            catch(e) {
                console.error("Could not save user profile.");
            }
        }
    };

    // Init to previously logged in user if possible.
    if (localStorage.profile) {
        try {
            user.profile = JSON.parse(localStorage.profile);
        }
        catch(e) {
            console.error("Could not parse existing user profile");
        }
    }

    return user;
});

app.factory('historyModel', function($http, $timeout) {
    console.log("entering historyModel");

    // List of messages in iterable format, and index of messages by id.
    var history = [];
    var historyIndex = {};

    var formatMessage = function(message) {
        message.date = moment(message.date).fromNow();
        return message;
    };

    var refreshHistory = function(messages) {
        var i;
        for (i = 0; i < history.length; i++) {
            history.pop();
        }
        for (i = 0; i < messages.length; i++) {
            history[i] = formatMessage(messages[i]);
        }
    };
    var updateHistory = function(messages) {
        // Assuming reverse chronology.
        var latestId;
        if (history[0]) {
            latestId = history[0].id;
            while (messages.length && messages[0].id > latestId) {
                history.unshift(messages.shift());
            }
        }
    };
    var update = function(messages) {
        var i, recentId;
        if (!history.length && messages.length) {
            refreshHistory(messages);
        }
        else {
            updateHistory(messages);
        }
    };

    // Repeatedly ping the server for messages.
    var requestHistory = function() {
        console.log("requesting history...");
        $http.get('http://bro.jeremyosborne.com/api/messagebro', {
                params: {
                    history: 1
                }
            })
            .success(function(data, status, headers, config) {
                console.log("History retrieved:", data);
                update(data.messages);
            })
            .error(function(data, status, headers, config) {
                console.log("Something bad happened:", data);
            });
    };
    // Begin the requests.
    var repeatRequest = function() {
        requestHistory();
        // Repeat. There is no $interval, only $timeout.
        $timeout(repeatRequest, 5000);
    };
    repeatRequest();

    // Expose the data. Model manages itself, whenever it updates, page
    // updates.
    return {
        history: history,
        requestHistory: requestHistory,
        update: update
    };
});

// Services are instantiated. An excuse to look at a service.
app.service('chatService', function($http, historyModel) {
    this.send = function(user, message) {
        $http.get('http://bro.jeremyosborne.com/api/messagebro', {
                params: {
                    user: user,
                    message: message
                }
            })
            .success(function(data, status, headers, config) {
                console.log("Services retrieved:", data);
                historyModel.update(data.messages);
            })
            .error(function(data, status, headers, config) {
                console.log("Something bad happened in the chatService:", data);
            });
    };
});

app.controller("pageController", function($scope) {
    console.log("entering pageController");
});

app.controller("loginController", function($scope, $location, userModel) {
    console.log("entering loginController");

    var attemptLogin = function() {
        if (userModel.isValid()) {
            // Move to the chat room view.
            $location.path("/chat");
        }
    };

    // Attempt to login when we get here.
    attemptLogin();

    // Map profile to the scope.
    $scope.profile = userModel.profile;
    // Map action to scope for usage as onsubmit in form.
    $scope.login = attemptLogin;
});

app.controller("chatController", function ($scope, $location, userModel, historyModel, chatService) {
    console.log("entering chatController");

    var validateSession = function() {
        if (!userModel.isValidSession()) {
            // Back to login.
            $location.path("/");
            return false;
        }
        else {
            return true;
        }
    };

    $scope.profile = userModel.profile;
    $scope.history = historyModel.history;
    $scope.message = "";

    // $handle form submissions
    $scope.chat = function() {
        console.log("Attempting to submit chat...");
        if (!validateSession()) {
            return;
        }
        chatService.send($scope.profile.name, $scope.message);
    };
});
