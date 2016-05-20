var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var busboy = require('connect-busboy');
var app = express();

/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * uncomment after placing your favicon in /public
 * app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 */

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(busboy());

/**
 * Passport initializing
 * Used to have an active session with an authorized user
 */
app.use(require('express-session')
({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Adds all the required functions for passport.
 */
var authentication = require('./models/authentication');

/**
 * Active links on the webserver. Add an required file linked to the variables set.
 */
var routes = require('./routes/index');

/**
 * Links the pages to Express
 */
app.use('/', routes);


/**
 * Mongoose database path.
 */
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://heroku_8vv7vcmf:i9717u1hkdvlr95ang67dp9cp1@ds011933.mlab.com:11933/heroku_8vv7vcmf');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
/**
 * Error Handlers
 *
 * 404, 500
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;