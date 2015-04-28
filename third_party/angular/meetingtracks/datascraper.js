// Don't run this unless you really need to update the data
// which you don't need to do.

var request = require('request');
var $ = require("cheerio");
var _ = require("underscore");
var async = require("async");
var fs = require("fs");

var BASE_URL = "http://meetinglibrary.asco.org";

/*
    Basic model
    {
        meetings: [
            {
                id: {Number},
                title: {String}, // Name of meeting
                href: {String},  // URL to meeting page
                sessions: [
                    {
                        id: {Number},
                        title: {String}, // Name of session
                        href: {String},  // URL to session
                        type: {String}   // Category of session
                    },
                    ...
                ]
            },
            ...
        ]
    }
*/

var id = 1;

var requestMeetings = function(done) {
    request.get(BASE_URL+"/VMTracks/2013%20ASCO%20Annual%20Meeting", function(err, res, content) {
        var page = $(content);

        // Get meetings...
        var meetings = page.find(".meeting_tracks a").map(function() {
            var el = $(this);
            return {
                id: id++,
                href: BASE_URL+el.attr("href"),
                title: el.html(),
                sessions: []
            };
        });
        done(null, meetings);
    });
};

var requestSessions = function(meetings, done) {
    var getSessionsFactory = function(meetingModel) {
        return function(next) {
            request.get(meetingModel.href, function(err, res, content) {
                var page = $(content);
                // Get meetings...
                var sessions = page.find(".views-table tbody tr").map(function() {
                    var el = $(this);
                    return {
                        id: id++,
                        title: el.first().find("a").html(),
                        href: BASE_URL+el.first().find("a").attr("href"),
                        type: el.find("td").last().html().trim()
                    };
                });
                meetingModel.sessions = sessions;
                next(null);
            });
        };
    };
    var meetingsToProcess = meetings.map(function(meeting) {
        return getSessionsFactory(meeting);
    });
    async.parallel(meetingsToProcess, function(err, response) {
        done(null, meetings);
    });
};


var processes = [
    requestMeetings,
    requestSessions,
];

async.waterfall(processes, function(err, meetingData) {
    meetingData = {meetings: meetingData };
    console.log("and done, writing data");
    fs.writeFileSync("public/meetingdata.json", JSON.stringify(meetingData)+"\n");
});
