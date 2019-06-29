var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc limit 11";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("main/main.html", {
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

module.exports = router;
