var express = require('express');
var path = require('path');

var app = express();

app.set('port', 8080);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var notes = [
    "Wax on, wax off.",
    "Sand the floor.",
    "Paint the house.",
];
app.get('/api', function(req, res) {
    res.send(notes);
});
app.post('/api', function(req, res) {
    var note = req.param("note");
    if (note) {
        notes.push(note);
        // Simple: on success resend notes.
        res.send(notes);
    }
    else {
        res.send(500, {error: "Code not process value of 'note' param of " + note});
    }
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


