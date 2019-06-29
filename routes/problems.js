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
  res.render("problems/problems.html", {
    title: 'Problems',
    is_login : req.session.is_login,
  });
});
function convert(pass) {
  var arr = new Array(5000);
  arr.fill(0);
  pass.forEach(function(e) {
    if(e.score == 100) arr[e.prob_id] = 2;
    else arr[e.prob_id] = 1;
  });
  return arr;
}
router.get('/prob_table', function(req, res, next) {
	//res.render("problems.html", {title: 'Problems',});
  var pass = [];
  if(req.session.is_login == 1) {
    var sql = "SELECT prob_id, score, MAX(time) FROM Result GROUP BY prob_id";
    console.log(sql);
    con.query(sql, function (err, rows) {
      console.log(rows);
      pass = rows;
    });
  }
  //console.log(pass);
	var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY id_Prob desc";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("problems/prob_table.html", {
			title: 'Problems',
			problems : rows,
      pass : convert(pass),
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
