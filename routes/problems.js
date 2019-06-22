var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "OTOG"
});
/* GET home page. */

router.get('/',function(req, res, next) {
  res.render("problems.html", {
    title: 'Problems'
  });
});

router.get('/prob_page', function(req, res, next) {
	//res.render("problems.html", {title: 'Problems',});
	var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY id_Prob desc";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("prob_page.html", {
			title: 'Problems',
			problems : rows,
      is_login : req.session.is_login,
		});
	});
});

router.get('/docs/:prob_name', function(req, res) {
	console.log(req.params.prob_name);
	res.sendFile(__dirname+'/docs/'+req.params.prob_name+'.pdf');
  //console.log(__dirname);
	//if (err) throw err;
	//res.redirect('/main');
});

module.exports = router;
