var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const config = require('./config/config.js');

var loginRouter = require('./routes/login');
var mainRouter = require('./routes/main');
var problemsRouter = require('./routes/problems');
var registerRouter = require('./routes/register');
var contestRouter = require('./routes/contest');
var IndexRouter = require('./routes/index');
var RatingsRouter = require('./routes/ratings');
var ConfigRouter = require('./routes/config');
var Logout = require('./routes/logout');
var UploadRouter = require('./routes/upload');
var SubmissionRouter = require('./routes/submission');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "qwert",
    resave: false,
    saveUninitialized: false
}));
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(fileUpload());


app.use('/', IndexRouter);
app.use('/main', mainRouter);
app.use('/problems', problemsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/contest', contestRouter);
app.use('/ratings', RatingsRouter);
app.use('/config', ConfigRouter);
app.use('/logout', Logout);
app.use('/upload', UploadRouter);
app.use('/submission', SubmissionRouter);

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
