var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("register/register.html", { title: 'register',status: true });
});
/* Register user. */
router.post('/', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var showname = req.body.showname;
  var sql = "SELECT * FROM User WHERE username = ?";
  con.query(sql, [username], function (err, old_user, fields) {
      //console.log(result);
    if(old_user[0] != null) {res.render("register/register.html", { title: 'register',status: false });
    }else {
      var sql = "INSERT INTO User (username, password, sname) VALUES ?"
      var values = [
      		[username, password, showname],
     	];
      con.query(sql, [values], function (err, result, fields) {
          if (err) throw err;
          console.log("Register Success!!");
      });
      res.redirect('login');
    }
  });
});
module.exports = router;
