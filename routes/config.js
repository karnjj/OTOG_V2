var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);

function is_admin(req) {
    if(req.session.is_admin == 0) return true;
    else return false;
}
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
router.get('/contest', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  res.render("config/contest.html", {
    title: 'config',
  });
});
router.get('/task', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
	var sql = "SELECT * FROM Problem ORDER BY id_Prob desc";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
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
    	//res.redirect('/config/task');
	});
});
module.exports = router;
