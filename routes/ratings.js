var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
/* GET home page. */
router.get('/', function(req, res, next) {
	var sql = "SELECT * FROM User ORDER BY rating desc";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("rating/ratings.html", {
			title: 'ratings',
			users : rows,
		});
	});
  	//res.render("ratings.html", { title: 'ratings' });
});

router.get('/head_rating', function(req, res, next) {
	res.render("rating/head_rating.html");
})

module.exports = router;
