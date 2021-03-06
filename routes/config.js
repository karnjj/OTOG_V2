var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var unzipper = require('unzipper');
var con = mysql.createConnection(global.gConfig.mysql);

function is_admin(req) {
    if(req.session.is_admin == 0) return true;
    else return false;
}
//main config
router.get('/', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Config";
  con.query(sql, function (err, rows) {
      if (err) throw err;
      res.render("config/config.html", {
        title: 'config',
        config: rows,
      });
  });
});
router.post('/config', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var millis = Date.now();
  time_now = Math.floor(millis/1000);
  var sql = "UPDATE Config SET mode = ?, click_time = ?";
	con.query(sql, [req.body.mode,time_now], function (err, rows) {
    	if (err) throw err;
	});
});
//edit task
router.get('/task', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Problem ORDER BY state desc,id_prob desc";
  con.query(sql, function (err, rows) {
    if (err) throw err;
    res.render("config/task.html", {
      title: 'task',
      problems : rows,
    });
  });
});
//new task
router.post('/task', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  console.log(req.files);
  var data = req.body;
  var sql = "insert into Problem (name, sname, score, time, memory) values ?";
  var values = [ 
    [data.name,data.sname,100,data.time,data.memory],
  ];
  con.query(sql,[values],(err,rows) => {
    if(err) throw err;
  })
  var dir = './source/' + data.sname;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFile(dir+'/script.php', 'cases = '+data.testcases+';', function (err) {
    if (err) throw err;
  });
  if(req.files.customfile_pdf) {
    var pdf_file = req.files.customfile_pdf;
    pdf_file.mv('./routes/docs/' + data.sname + ".pdf");
  }
  if(req.files.customfile_zip) {
    var zip_dir = dir + '/' + data.sname + ".zip";
    var zip_file = req.files.customfile_zip;
    zip_file.mv(zip_dir);
    fs.createReadStream(zip_dir)
      .pipe(unzipper.Extract({ path: dir }));
    fs.unlink(zip_dir, function (err) {
      if (err) throw err;
    }); 
  }
  res.redirect('/config/task');
});
router.post('/toggle', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var millis = Date.now();
  var time_now = Math.floor(millis/1000);
  var sql = "UPDATE Problem SET state = ?, see_date = ? WHERE id_Prob = ?";
  con.query(sql, [req.body.state,time_now,req.body.id], function (err, rows) {
    if (err) throw err;
  });
});
//config contest
router.get('/contest', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "SELECT * FROM Problem ORDER BY id_Prob desc";
	con.query(sql, function (err, prob) {
    	if (err) throw err;
      var sql = "SELECT * FROM Contest";
      con.query(sql, function (err, contest) {
        res.render("config/contest.html", {
          title: 'config',
          problems: prob,
          contest_ls: contest,
        });
      });
  });
});
router.post('/contest/new', function(req, res, next) {
  var data = req.body;
  var time_start = Date.parse(data.time_start)/1000 - 25200;
  var time_end = Date.parse(data.time_end)/1000 - 25200;
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "INSERT INTO Contest (name,mode_grader,judge,time_start,time_end) VALUES ?"
  var values = [
    [data.name,data.mode_grader,data.judge,time_start,time_end],
  ]
  con.query(sql, [values], function (err, rows) {
      if (err) throw err;
  });
  console.log(req.body);
  res.redirect('/config/contest');
});
router.post('/contest/update', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "UPDATE Contest SET problems = ? WHERE name = ?";
  //console.log(req.body);
	con.query(sql, [req.body.problem, req.body.name], function (err, rows) {
    	if (err) throw err;
	});
});
router.post('/del', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "delete from Result where idResult = ?";
  con.query(sql, [req.body.idSub], function (err, rows) {
      if (err) throw err;
      res.status(200);
  });
});
router.post('/del_task', function(req, res, next) {
  if(!is_admin(req)) {res.redirect('/main'); return 0;}
  var sql = "select * from Problem where id_Prob = ?";
  con.query(sql, [req.body.idSub], (err,rows)=> {
    //console.log(rows[0]);
    var dir = './source/' + rows[0].sname;
    fs.rmdirSync(dir, { recursive: true });
  })
  var sql = "delete from Problem where id_Prob = ?";
  con.query(sql, [req.body.idSub], function (err, rows) {
      if (err) throw err;
  });
  res.status(200);
});
module.exports = router;
