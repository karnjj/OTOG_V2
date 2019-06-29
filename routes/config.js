var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render("problems.html", {title: 'Problems',});
	var sql = "SELECT * FROM Problem";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("config/config.html", {
			title: 'config',
			problems : rows,
		});
	});
});
module.exports = router;
