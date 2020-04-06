var createError = require('http-errors'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	express = require('express'),
	passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	path = require('path'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require("express-session"),
	flash = require('connect-flash'),
	User = require("./models/user");
// logger = require('morgan');

var app = express();

// Import ruoters
var notesRouter = require('./routes/notes');
var usersRouter = require('./routes/users');

// Connect to DB
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/notes_app', { useUnifiedTopology: true, useNewUrlParser: true });

// Passport 
app.use(session({
	secret: "This is my top top secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("view engine", "ejs");                      // Set up  extions for render purposes
app.use(methodOverride("_method"));                 // Set a custom methods over post

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Locals
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.title = "Notes App";
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.get('/', (req, res) => {
	res.render('index', { title: 'Notes Application' });
});
app.use('/notes', notesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
