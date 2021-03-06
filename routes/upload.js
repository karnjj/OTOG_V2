var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
/* GET home page. */
router.post('/', function(req, res, next){
  let idContest = req.body.contest_id;
  if(!req.files || req.session.is_login != 1) {
    res.send({
      status: false,
      message: 'No file uploaded or not login'
    });
  } else {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let upload_file = req.files.customfile;
    let prob_id = req.body.prod_id;
    var millis = Date.now();
    time_now = Math.floor(millis/1000);
    console.log(prob_id);
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    upload_file.mv('./uploaded/' + prob_id + "_" + req.session.name_id + "_" +time_now+".cpp");
    if(idContest == undefined) idContest = null;
    var sql = "INSERT INTO Result (time, user_id, prob_id, status,contestmode) VALUES ?";
    var values = [[time_now,req.session.name_id,Number(prob_id),0,idContest],];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
    });
    //send response
  }
  if(idContest == null) res.redirect('/submission');
  else res.redirect('/contest/submission');
});


module.exports = router;
