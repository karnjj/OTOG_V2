var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "OTOG"
});
var name_user = 'Guest';
var is_login = 0;
con.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc limit 11";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("main.html", { 
      title: 'main',
      showname: name_user,
      is_login: is_login,
      problems : result,
    });
    //console.log(Problems);
  });
  
});

router.post('/', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc limit 11";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    Problems = result;
    console.log(Problems);
  });
	var sql = "SELECT password, show_name FROM User WHERE username = ?";
	con.query(sql, [username], function (err, result, fields) {
    if (err) throw err;
    
    if(result[0] == null) res.redirect('login');
    else if(result[0].password != password) {
      res.redirect('login');
    }else {
      name_user = result[0].show_name;
      console.log(name_user);
      is_login = 1;
      res.render("main.html", { 
        title: 'main',
        showname: name_user,
        is_login: is_login,
        problems : Problems,
      });
    }
    //console.log(result);
  });
  
});

module.exports = router;
