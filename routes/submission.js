var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
module.exports = function(io) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		//res.render("problems.html", {title: 'Problems',});
			res.render("problems/submission.html", {
				title: 'Problems',
				is_login: req.session.is_login,
				id_user: req.session.name_id,
			});
	});
	return router;
};
