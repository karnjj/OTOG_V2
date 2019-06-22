var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "OTOG"
});
con.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("register.html", { title: 'register' });
});
/* Register user. */
router.post('/', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var showname = req.body.showname;
  var sql = "INSERT INTO User (username, password, show_name) VALUES ?"
  var values = [
  		[username, password, showname],
 	];
  con.query(sql, [values], function (err, result, fields) {
      if (err) throw err;
      console.log("Register Success!!");
  });
  res.redirect('login');
});
module.exports = router;