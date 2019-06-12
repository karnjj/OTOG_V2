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
	var sql = "SELECT * FROM User";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("ratings.html", {
			title: 'ratings',
			users : rows,
		});
	});	
  	//res.render("ratings.html", { title: 'ratings' });
});

router.get('/head_rating', function(req, res, next) {
	res.render("head_rating.html");
})

module.exports = router;
