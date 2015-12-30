
/**
 * Module dependencies
 */
var app=require('express')();

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http').Server(app),
  path = require('path'),
  io = require('socket.io')(http);

//var server = http.createServer(app);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
//app.get('/', routes.index);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);



io.on('connection', function(socket) {
  console.log('A user has connected');

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
    console.log('chat message: ' + msg);
  });
  
  socket.on('disconnect', function() {
    console.log('A user has disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on ' + app.get('port'));
});





/**
 * Start Server
 */
/*
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
*/