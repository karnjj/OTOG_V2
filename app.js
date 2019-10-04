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
var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '0000',
  database: 'OTOG'
};
var sessionStore = new MySQLStore(options);
var loginRouter = require('./routes/login');
var mainRouter = require('./routes/main');
var chatRouter = require('./routes/chat');
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
var scriptsRouter = require('./routes/scripts');

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
    store: sessionStore,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(fileUpload());


app.use('/', IndexRouter);
app.use('/main', mainRouter);
//app.use('/chat', chatRouter);
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
//app.use('/scripts', scriptsRouter);
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
  console.log('Client connected..');
  var sql = "SELECT Result.idResult,Problem.name,User.sname,Result.result,Result.score,Result.timeuse,User.rating,Result.user_id,Result.status FROM Result "
  +"INNER JOIN Problem ON Result.prob_id=Problem.id_Prob "
  +"INNER JOIN User ON Result.user_id=User.idUser ORDER BY Result.time desc LIMIT 100";
  var serverInterval = setInterval(function() {
    if(io.onload != true) {clearInterval(serverInterval)};
    //console.log("pass");
    if(io.senddata == true) {
      con.query(sql, function (err, rows) {
        if (err) throw err;
        io.sockets.emit('submission',{submission:rows});
      });
      con.commit();
    }
  },1000);
  client.on('req_table',function(data){
      console.log(data);
      io.onload = true;
      io.senddata = true;
  });
  client.on("stop_req", function(data){
    console.log(data);
    io.senddata = false;
    //clearInterval(io.serverInterval);
  });
  /*
  client.on("typing", data => {
    client.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });*/
  client.on("chat message", function(data) {
    //console.log("message: "  +  data.msg);
    //broadcast message to everyone in port:5000 except yourself.
    client.broadcast.emit("received", { message: data.msg,user : data.user  });

    //save chat to the database
    var millis = Date.now();
    var time_now = Math.floor(millis/1000);
    var sql = "INSERT INTO Chat (msg, user, time) VALUES ?"
    var values = [
        [data.msg, data.user, time_now],
     ];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
    });
    /*
    connect.then(db  =>  {
      console.log("connected correctly to the server");

      let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
      chatMessage.save();
    });
    */
  });
});
module.exports = {app: app, server: server};
