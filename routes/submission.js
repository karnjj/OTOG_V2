var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
module.exports = function(io) {
	router.get('/', async function(req, res, next) {
		var lastest = null;
		var name = "";
		var sql = "select name,id_Prob from ( select max(idResult) as lastest from Result where user_id = ?) "+
			"as X inner join Result on Result.idResult = X.lastest inner join Problem on prob_id = Problem.id_Prob"
		if(req.session.name_id != undefined) {
			lastest = await new Promise((resolve, reject) => con.query(sql,[req.session.name_id], function(err,result){
				if (err) reject(err)
				else resolve(result[0]);
			}));
			if(lastest == undefined) lastest = null,name = "";
			else name = lastest.name;
		}
		res.render("problems/submission.html", {
			title: 'Problems',
			is_login: req.session.is_login,
			id_user: req.session.name_id,
			is_admin: req.session.is_admin,
			lastest : lastest,
			name: name
		});
	});
	return router;
};
