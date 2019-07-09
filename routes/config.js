var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);

router.get('/', function(req, res, next) {
  res.render("config/config.html", {
    title: 'config',
  });
});
router.get('/contest', function(req, res, next) {
  res.render("config/contest.html", {
    title: 'config',
  });
});
router.get('/task', function(req, res, next) {
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
