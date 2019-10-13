var express = require('express');
var router = express.Router();
const ChildProcess = require('child_process');
let runSh = new Promise(function(success, nosuccess) {
    ChildProcess.exec('~/OTOG_V2/./restart.sh',
    function (error, stdout, stderr) {
        console.log(error,stdout,stderr);
        if (error !== null || stderr !== null) {
        nosuccess('exec error: ' + error + '\nstderr : '+stderr);
        }else success('stdout: ' + stdout);
    });
})

/* GET home page. */
router.get('/', function(req, res, next) {
    runSh.then(function(result) {
        console.log(result);
        res.end(result);
    }).catch(function(result){
        console.log(result);
        res.end(result);
    })
});


module.exports = router;
