var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
var total_pass = 0;
var total_nopass = 0;
var prob_today = 0;
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
function cnt(rows,passcnt) {
  prob_today = 0;
  var millis = Date.now();
  var time_now = Math.floor(millis/1000);
  //console.log(time_now);
  var arr = new Array(1000);
  arr.fill(0);
  passcnt.forEach(function(e) {
    arr[e.prob_id] = arr[e.prob_id] + 1;
  });
  rows.forEach(function(part, index) {
    this[index].pass = arr[part.id_Prob];
    if(this[index].see_date > (time_now - 86400)) {
      prob_today = prob_today + 1;
    }
    //console.log(prob_today);
    
  }, rows);
  //console.log(prob_today);
  
  return rows;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  total_pass = 0;
  total_nopass = 0;
  var pass = [];
  var passcnt = [];
  var sql = "SELECT User.sname,Result.prob_id FROM Result INNER JOIN User ON Result.user_id=User.idUser "
          +"WHERE state = 1 and score = 100 group by CONCAT(prob_id, '_', user_id)";
    //console.log(sql);
  con.query(sql, function (err, rows) {
    //console.log(err);
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
  var sql = "SELECT * FROM Problem WHERE state = 1 ORDER BY see_date desc";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    req.sessionStore.all(function(err, online) {
      var arr = new Array;
      for(var i in online) {
        arr.push(online[i].name_user);
      }
      res.render("main/main.html", {
        title: 'main',
        showname: req.session.name_user,
        is_login: req.session.is_login,
        pass : convert(pass),
        allprob: result.length,
        passprob: total_pass,
        notpassed: total_nopass,
        nosub: result.length-(total_pass+total_nopass),
        problems : cnt(result,passcnt),
        todayprob: prob_today,
        online : arr.length,
        who_online : arr
      });
    });
    //console.log(Problems);
  });
});

module.exports = router;
