var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
module.exports = function(io) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		//res.render("problems.html", {title: 'Problems',});
		var sql = "SELECT Result.idResult,Problem.name,User.sname,Result.result,Result.score,Result.timeuse,User.rating,Result.user_id,Result.status FROM Result "
	            +"INNER JOIN Problem ON Result.prob_id=Problem.id_Prob "
	            +"INNER JOIN User ON Result.user_id=User.idUser ORDER BY Result.time desc";
		con.query(sql, function (err, rows) {
	    	if (err) throw err;
	    	//console.log(rows);
			res.render("problems/submission.html", {
				title: 'Problems',
				submission : rows,
				is_login: req.session.is_login,
				id_user: req.session.name_id,
			});
		});
	});
	/*
	io.on('connection',function(client){
    console.log('Client connected..');
    client.on('join',function(data){
        console.log(data);
    });
    setInterval(function() {
				var sql = "SELECT Result.idResult,Problem.name,User.sname,Result.result,Result.score,Result.timeuse,User.rating,Result.user_id,Result.status FROM Result "
									+"INNER JOIN Problem ON Result.prob_id=Problem.id_Prob "
									+"INNER JOIN User ON Result.user_id=User.idUser ORDER BY Result.time desc";
				con.query(sql, function (err, rows) {
					if (err) throw err;
					//console.log(rows);
					io.sockets.emit('submission',{submission:rows});
				});
				con.commit();
    },1000);
		//con.end();
	});
	*/
	return router;
};
