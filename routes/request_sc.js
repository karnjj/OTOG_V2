const fs = require('fs');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
con.connect();
router.post('/', function(req, res) {
  var sql = "SELECT * FROM Result WHERE idResult = ?";
  console.log(req.body.id);
  con.query(sql, [req.body.id], function (err, rows, fields) {
    //console.log(__dir);
    file_name = rows[0].prob_id + "_" + rows[0].user_id + "_" + rows[0].time + ".cpp";
    var contents = fs.readFileSync('./uploaded/'+file_name,'utf8');
    console.log(contents);
    res.send(contents);
  });
});
module.exports = router;
