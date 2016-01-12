
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
  io = require('socket.io')(http),
  passport = require('passport');
  LocalStrategy = require('passport-local').Strategy;
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

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/login', loginGet);

function loginGet(req, res){
  if(req.user){
    // already logged in
    res.redirect('/');
  } else {
    // not logged in, show the login form, remember to pass the message
    // for displaying when error happens
    res.render('login', { message: req.session.messages });
    // and then remember to clear the message
    req.session.messages = null;
  }
}
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




passport.use(new LocalStrategy({
    // set the field name here
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    /* get the username and password from the input arguments of the function */

    // query the user from the database
    // don't care the way I query from database, you can use
    // any method to query the user from database
    User.find( { where: {username: username}} )
      .success(function(user){
      
        if(!user)
          // if the user is not exist
          return done(null, false, {message: "The user is not exist"});
        else if(!hashing.compare(password, user.password))
          // if password does not match
          return done(null, false, {message: "Wrong password"});
        else
          // if everything is OK, return null as the error
          // and the authenticated user
          return done(null, user);
        
      })
      .error(function(err){
        // if command executed with error
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // query the current user from database
  User.find(id)
    .success(function(user){
        done(null, user);
    }).error(function(err){
        done(new Error('User ' + id + ' does not exist'));
    });
});

app.post('/login', loginPost);

function loginPost(req, res, next) {
  // ask passport to authenticate
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      // if error happens
      return next(err);
    }
    
    if (!user) {
      // if authentication fail, get the error message that we set
      // from previous (info.message) step, assign it into to
      // req.session and redirect to the login page again to display
      req.session.messages = info.message;
      return res.redirect('/login');
    }

    // if everything's OK
    req.logIn(user, function(err) {
      if (err) {
        req.session.messages = "Error";
        return next(err);
      }

      // set the message
      req.session.messages = "Login successfully";
      return res.redirect('/');
    });
    
  })(req, res, next);
}
