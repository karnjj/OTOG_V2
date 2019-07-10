var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
function convert(pass) {
  var arr = new Array(5000);
  arr.fill(0);
  pass.forEach(function(e) {
    if(arr[e.prob_id] == 0) {
      if(e.score == 100) {
        arr[e.prob_id] = 2;
      }else {
        arr[e.prob_id] = 1;
      }
    }
  });
  return arr;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM Config";
  con.query(sql, function (err, rows) {
      if (err) throw err;
      res.render("contest/contest.html", {
        title: 'Contest',
        is_login: req.session.is_login,
        config: rows,
      });
  });
});

router.get('/unshow_contest', function(req, res, next) {
  res.render("contest/unshow_contest.html", { title: 'Contest' });
});

router.get('/show_contest', function(req, res, next) {
  var pass = [];
  var config = [];
  if(req.session.is_login == 1) {
    var sql = "SELECT * FROM Result WHERE user_id = "+req.session.name_id+" ORDER BY time desc";
    con.query(sql, function (err, rows) {pass = rows;});
  }
  var sql = "SELECT * FROM Config";
  con.query(sql, function (err, rows) {
    config = rows;
    var sql = "SELECT * FROM Problem WHERE state = 1 AND see_date >= ? ORDER BY see_date desc";
    con.query(sql, [config[0].click_time], function (err, result, fields) {
      if (err) throw err;
      res.render("contest/show_contest.html", {
        title: 'Contest',
        is_login: req.session.is_login,
        pass : convert(pass),
        problems : result,
      });
    });
  });
});

module.exports = router;
