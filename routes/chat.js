var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
router.get('/', function(req, res, next) {
	res.render("main/chat.html",{
		title: 'Live Chat',
	});
})
router.get('/history', function(req, res, next) {
	sql = "SELECT * FROM Chat ORDER BY idChat";
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
})
module.exports = router;
