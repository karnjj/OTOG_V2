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
    	console.log(rows);
		res.render("problems.html", {
			title: 'Problems',
			problems : rows,
		});
	});
});

router.get('/docs/:prob_name', function(req, res) {
	console.log(req.params.prob_name);
	res.sendFile(__dirname+'/docs/'+req.params.prob_name+'.pdf');
	//if (err) throw err;
	//res.redirect('/main');
});

module.exports = router;