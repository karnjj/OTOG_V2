var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
/* GET home page. */
router.get('/rating_table', function(req, res, next) {
	var sql = "SELECT sname,rating FROM User ORDER BY rating desc";
	/*var sql = "SELECT sname,rating FROM User inner join Result as R on User.idUser = R.user_id "+
			"where contestmode is not null and state = 1 group by sname order by rating desc"
			*/
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("rating/rating_table.html", {
			title: 'ratings',
			users : rows,
		});
	});
  	//res.render("ratings.html", { title: 'ratings' });
});

router.get('/', function(req, res, next) {
	res.render("rating/ratings.html",{
		is_login: req.session.is_login,
	});
})

module.exports = router;
