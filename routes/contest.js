var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("contest.html", { title: 'Contest' });
});

router.get('/unshow_contest', function(req, res, next) {
  res.render("unshow_contest.html", { title: 'Contest' });
});

router.get('/show_contest', function(req, res, next) {
  res.render("show_contest.html", { title: 'Contest' });
});
module.exports = router;
