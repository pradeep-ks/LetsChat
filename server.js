var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// Uncomment the following code to run on Heroku
var port = process.env.PORT || 5500;
app.use(express.static(__dirname)); // serving a static file inside current directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var databaseUrl = 'mongodb://admin:admin@ds229909.mlab.com:29909/sample-db';

// Define the Message model
var Message = mongoose.model('Message', { name: String, text: String });
/* 
var messages = [
    { name: 'John', text: 'John says hello!' },
    { name: 'Pradeep', text: 'Pradeep says hello!' }
];
 */
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// post a new message
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err) {
            sendStatus(500);
        }
        // messages.push(req.body);
        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

// socket.io event
io.on('connection', (socket) => {
    console.log('Testing socket.io connection....');
});

// connect to database
mongoose.connect(databaseUrl, (err) => {
    console.log('Connection Successfull....');
});
// listen to http port
var server = http.listen(port, () => {
    console.log('Server is now listening on port %d', /* server.address(). */port);
});        // listen to port 4100
