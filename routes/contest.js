var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);

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

function cnt(rows,passcnt) {
  var arr = new Array(1000);
  arr.fill(0);
  passcnt.forEach(function(e) {
    arr[e.prob_id] = arr[e.prob_id] + 1;
  });
  rows.forEach(function(part, index) {
    this[index].pass = arr[part.id_Prob];
  }, rows);
  return rows;
}

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

router.get('/id/:idContest', async function(req, res, next) {
  var pass = [];
  var passcnt = [];
  /*
  con.query(sql,[req.params.idContest],function (err, contest) {
    if(err) throw err;
    problem = contest[0].problems;
    problem[0] = '(';
    problem[problem.length-1] = ')';
  });
  */
  var sql = "SELECT * FROM Contest WHERE idContest = ?";
  var problem = await new Promise((resolve, reject) => con.query(sql, [req.params.idContest], function(err,result){
    if (err) reject(err)
    else resolve(JSON.parse(result[0].problems));
  }));
  var sql = "SELECT User.sname,Result.prob_id FROM Result INNER JOIN User ON Result.user_id=User.idUser "
          +"WHERE state = 1 and score = 100 group by CONCAT(prob_id, '_', user_id)";
    //console.log(sql);
    con.query(sql, function (err, rows) {
      if(err) throw err;
      passcnt = rows;
    });
  if(req.session.is_login == 1) {
    var sql = "SELECT * FROM Result WHERE user_id = "+req.session.name_id+" ORDER BY time desc";
    //console.log(sql);
    con.query(sql, function (err, rows) {
      //console.log(rows);
      pass = rows;
    });
  }
  //console.log(req.session.is_admin);
  var sql = "SELECT * FROM Problem WHERE id_Prob IN (?)";
	con.query(sql, [problem], function (err, rows) {
    	if (err) throw err;
    	//console.log(rows);
		res.render("contest/contest_table.html", {
			title: 'Problems',
			problems : cnt(rows,passcnt),
      pass : convert(pass),
      is_login : req.session.is_login,
      idContest : req.params.idContest,
		});
	});
});

router.get('/submission', function(req, res, next) {
  //res.render("problems.html", {title: 'Problems',});
    res.render("contest/contest_submission.html", {
      title: 'Submission',
      is_login: req.session.is_login,
      id_user: req.session.name_id,
      is_admin: req.session.is_admin,
      idContest: req.params.idContest
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
