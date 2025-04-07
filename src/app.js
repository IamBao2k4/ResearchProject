var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./middlewares/localStrategy'); // Import the local strategy
const db = require("./config/db");
const hbs = require("hbs");
const { engine } = require("express-handlebars");

const route = require("./routes");

var app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
