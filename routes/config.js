var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);

function is_admin(req) {
    if(req.session.is_admin == 0) return true;
    else return false;
}
//main config
router.get('/', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Config";
  con.query(sql, function (err, rows) {
      if (err) throw err;
      res.render("config/config.html", {
        title: 'config',
        config: rows,
      });
  });
});
router.post('/config', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var millis = Date.now();
  time_now = Math.floor(millis/1000);
  var sql = "UPDATE Config SET mode = ?, click_time = ?";
	con.query(sql, [req.body.mode,time_now], function (err, rows) {
    	if (err) throw err;
	});
});
//edit task
router.get('/task', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Problem ORDER BY state desc,id_prob desc";
  con.query(sql, function (err, rows) {
    if (err) throw err;
    res.render("config/task.html", {
      title: 'task',
      problems : rows,
    });
  });
});
router.post('/toggle', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var millis = Date.now();
  var time_now = Math.floor(millis/1000);
  var sql = "UPDATE Problem SET state = ?, see_date = ? WHERE id_Prob = ?";
  con.query(sql, [req.body.state,time_now,req.body.id], function (err, rows) {
    if (err) throw err;
  });
});
//config contest
router.get('/contest', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Problem ORDER BY id_Prob desc";
	con.query(sql, function (err, prob) {
    	if (err) throw err;
      var sql = "SELECT * FROM Contest";
      con.query(sql, function (err, contest) {
        res.render("config/contest.html", {
          title: 'config',
          problems: prob,
          contest_ls: contest,
        });
      });
  });
});
router.post('/contest/new', function(req, res, next) {
  var data = req.body;
  var time_start = Date.parse(data.time_start)/1000 - 25200;
  var time_end = Date.parse(data.time_end)/1000 - 25200;
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "INSERT INTO Contest (name,mode_grader,judge,time_start,time_end) VALUES ?"
  var values = [
    [data.name,data.mode_grader,data.judge,time_start,time_end],
  ]
  con.query(sql, [values], function (err, rows) {
      if (err) throw err;
  });
  console.log(req.body);
  res.redirect('/config/contest');
});
router.post('/contest/update', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "UPDATE Contest SET problems = ? WHERE name = ?";
  //console.log(req.body);
	con.query(sql, [req.body.problem, req.body.name], function (err, rows) {
    	if (err) throw err;
	});
});

module.exports = router;
