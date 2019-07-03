var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
var total_pass = 0;
var total_nopass = 0;
function convert(pass) {
  var arr = new Array(5000);
  arr.fill(0);
  pass.forEach(function(e) {
    if(arr[e.prob_id] == 0) {
      if(e.score == 100) {
        arr[e.prob_id] = 2;
        total_pass++;
      }else {
        arr[e.prob_id] = 1;
        total_nopass++;
      }
    }
  });
  return arr;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  total_pass = 0;
  total_nopass = 0;
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
      pass : convert(pass),
      allprob: result.length,
      passprob: total_pass,
      notpassed: total_nopass,
      nosub: result.length-(total_pass+total_nopass),
      problems : result,
    });
    //console.log(Problems);
  });
});

module.exports = router;
