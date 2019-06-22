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
/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc limit 11";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //console.log(arr["Login_status"]);
    res.render("main.html", {
      title: 'main',
      showname: req.session.name_user,
      is_login: req.session.is_login,
      allprob: result.length,
      passprob: 0,
      notpassed: 0,
      nosub: 0,
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
    //console.log(Problems);
  });
	var sql = "SELECT password, sname, idUser FROM User WHERE username = ?";
	con.query(sql, [username], function (err, result, fields) {
    if (err) throw err;

    if(result[0] == null) res.redirect('login');
    else if(result[0].password != password) {
      res.redirect('login');
    }else {
      req.session.username = username;
      req.session.is_login = 1;
      req.session.name_user = result[0].sname;
      req.session.name_id = result[0].idUser
      //console.log(name_user);
      res.render("main.html", {
        title: 'main',
        showname: req.session.name_user,
        is_login: req.session.is_login,
        allprob: result.length,
        passprob: 0,
        notpassed: 0,
        nosub: 0,
        problems : Problems,
      });
    }
    //console.log(result);
  });

});

module.exports = router;
