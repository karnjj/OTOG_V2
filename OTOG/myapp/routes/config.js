var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "OTOG"
});
/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render("problems.html", {title: 'Problems',});
	var sql = "SELECT * FROM Problem";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("config.html", {
			title: 'config',
			problems : rows,
		});
	});
});
module.exports = router;
