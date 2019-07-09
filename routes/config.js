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
  res.render("config/config.html", {
    title: 'config',
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
module.exports = router;
