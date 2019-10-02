const config = require('./config/config.js');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);

const fileUpload = require('express-fileupload');
const session = require('express-session');

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
var SubmissionRouter = require('./routes/submission')(io);
var scoreboardRouter = require('./routes/scoreboard');
var request_scRouter = require('./routes/request_sc');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "phakphum",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
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
app.use('/scoreboard', scoreboardRouter);
app.use('/request_sc', request_scRouter);
/*
app.use(function(req, res, next){
  res.io = io;
  next();
});
*/
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
  //res.render('error');
  console.log(res.locals.error);
  res.redirect("/main");
});
io.on('connection',function(client){
  var Interval = null;
  console.log('Client connected..');
  client.on('req_table',function(data){
      console.log(data);
      var sql = "SELECT Result.idResult,Problem.name,User.sname,Result.result,Result.score,Result.timeuse,User.rating,Result.user_id,Result.status FROM Result "
      +"INNER JOIN Problem ON Result.prob_id=Problem.id_Prob "
      +"INNER JOIN User ON Result.user_id=User.idUser ORDER BY Result.time desc LIMIT 100";
      Interval = setInterval(function() {
        //console.log("pass");
        con.query(sql, function (err, rows) {
          if (err) throw err;
          io.sockets.emit('submission',{submission:rows});
        });
        con.commit();
      },1000);
  });
  client.on("stop_req", function(data){
    console.log(data);
    clearInterval(Interval);
  });
});
module.exports = {app: app, server: server};
