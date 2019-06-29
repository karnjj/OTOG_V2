var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var con = mysql.createConnection(global.gConfig.mysql);
/* GET home page. */

router.get('/', function(req, res, next) {
	//res.render("problems.html", {title: 'Problems',});
	var sql = "SELECT Result.idResult,Problem.name,User.sname,Result.result,Result.score,Result.timeuse,User.rating FROM Result "
            +"INNER JOIN Problem ON Result.prob_id=Problem.id_Prob "
            +"INNER JOIN User ON Result.user_id=User.idUser ORDER BY Result.time desc";
	con.query(sql, function (err, rows) {
    	if (err) throw err;
    	console.log(rows);
		res.render("problems/submission.html", {
			title: 'Problems',
			submission : rows,
			is_login: req.session.is_login,
		});
	});
});
module.exports = router;
