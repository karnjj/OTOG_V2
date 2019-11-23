var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();

function make_scoreboard(results){
  var new_result = [];
    var task = [];
    var data = {};
    var prev = '';
    results.forEach((e,index) => {
      //console.log(index);
      if(prev != e.sname && index != 0) {
        data.task = task;
        new_result.push(data);
        data = {};
        task = [];
      }
      data.name = e.sname;
      if(data.score == undefined) data.timeuse = data.score = 0;
      data.score += e.score;
      data.timeuse += e.timeuse;
      task.push({'task':e.prob_id,'score':e.score,'timeuse':e.timeuse});
      prev = e.sname;
    });
    data.task = task;
    new_result.push(data);
    //console.log(new_result.length);
  return new_result
}

/* GET home page. */
router.get('/id/:idContest', async function(req, res, next) {
  console.log(req.params.idContest);
  
  var sql = "SELECT problems FROM Contest WHERE idContest = ?";
  var res1 = await new Promise((resolve, reject) => con.query(sql, [req.params.idContest], function(err,result){
    if (err) reject(err)
    else resolve(result[0].problems);
  }));
  var problem = JSON.parse(res1);
  var sql =
    "select User.sname,R.prob_id,R.score,R.timeuse "+
    "from (select user_id,prob_id, max(time) as latest from Result where contestmode = ? group by user_id,prob_id) "+
    "as x inner join Result as R on R.user_id = x.user_id and R.prob_id = x.prob_id and R.time = x.latest "+
    "inner join User on R.user_id = User.idUser where User.state = 1 group by sname,prob_id order by User.sname"
  await con.query(sql, [req.params.idContest], async function(err,results) {
    if(err) throw err;
    
    result = await new Promise((resolve, reject) => resolve(make_scoreboard(results)))
    //console.log(result);
    await result.sort((a,b) => {return b.score-a.score;})
    //console.log(result);
    var sql = "SELECT * FROM Problem WHERE id_Prob IN (?)";
    con.query(sql, [problem], function (err, rows) {
        if (err) throw err;
        //console.log(rows);
      res.render("contest/scoreboard.html", {
        title: 'scoreboard',
        score : result,
        problem : rows,
        is_login : req.session.is_login
      });
    });
  })
});


module.exports = router;
