var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();

function convert(pass) {
  var arr = new Array(5000);
  arr.fill(0);
  pass.forEach(function(e) {
    if(arr[e.prob_id] == 0) {
      if(e.score == 100) arr[e.prob_id] = 2;
      else arr[e.prob_id] = 1;
    }
  });
  return arr;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var pass = [];
  if(req.session.is_login == 1) {
    var sql = "SELECT * FROM Result WHERE user_id = "+req.session.name_id+" ORDER BY time desc";
    //console.log(sql);
    con.query(sql, function (err, rows) {
      //console.log(rows);
      pass = rows;
    });
  }
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc";
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
      pass : convert(pass),
    });
    //console.log(Problems);
  });
});

module.exports = router;
