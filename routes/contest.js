var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM Config";
  con.query(sql, function(err, rows) {
    if (err) throw err;
    res.render("contest/contest.html", {
      title: 'Contest',
      is_login: req.session.is_login,
      config: rows,
    });
  });
});

router.get('/unshow_contest', function(req, res, next) {
  res.render("contest/unshow_contest.html", {
    title: 'Contest'
  });
});

router.get('/show_contest', function(req, res, next) {
  var sql = "SELECT * FROM Contest";
  con.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.render("contest/show_contest.html", {
      title: 'Contest',
      is_login: req.session.is_login,
      contest: result,
    });
  });
});

module.exports = router;
