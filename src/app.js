var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
<<<<<<< HEAD
const db = require("./config/db");
=======
var session = require('express-session');
var passport = require('./middlewares/localStrategy'); // Import the local strategy
const db = require("./config/db");
const hbs = require("hbs");
const { engine } = require("express-handlebars");
>>>>>>> origin/fix_practice_logic

const route = require("./routes");

var app = express();

<<<<<<< HEAD
// Connect to MongoDB
db.connect();

// view engine setup
app.set('views', path.join(__dirname, "resources", "views"));
app.set('view engine', 'jade');
=======
// Register Handlebars helpers
require('./helpers/handlebars');

// Connect to MongoDB
db.connect();

// template engine
app.engine("hbs", engine({ extname: '.hbs' }));

// view engine setup
app.set('views', path.join(__dirname, "resources", "views"));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, "resources", "views", "partials"));
>>>>>>> origin/fix_practice_logic

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
<<<<<<< HEAD
// Routes init
route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
=======

// Session middleware
app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes init
route(app);

module.exports = app;
>>>>>>> origin/fix_practice_logic
