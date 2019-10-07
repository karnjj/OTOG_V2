var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var sha256 = require('js-sha256');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("login/login.html", { title: 'login',status : true });
});
router.post('/', function(req, res){
  var hash = sha256.create();
	var username = req.body.username;
  var password = req.body.password;
  var remember = req.body.remember;
  
  hash.update(password);
	var sql = "SELECT * FROM User WHERE username = ?";
	con.query(sql, [username], function (err, result, fields) {
    if (err) throw err;

    if(result[0] == null) res.render("login/login.html", { title: 'login',status : false });
    else if(result[0].password != hash.hex()) {
      res.render("login/login.html", { title: 'login',status : false });
    }else {
      req.session.name_user = result[0].sname;
      req.session.name_id = result[0].idUser;
      req.session.is_admin = result[0].state;
      if(remember == "true") req.session.cookie.maxAge = 86400000;
      req.session.is_login = 1;
      //console.log(name_user);
      res.redirect('main');
    }
    //console.log(result);
  });

});

module.exports = router;
