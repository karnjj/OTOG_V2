var express = require('express');
var router = express.Router();
const ChildProcess = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
    let runSh = new Promise(function(success, nosuccess) {
        ChildProcess.exec('~/OTOG_V2/./restart.sh',
        function (error, stdout, stderr) {
            console.log(error,stdout,stderr);
            if (error !== null) {
                nosuccess('exec error: ' + error + '\nstderr : '+stderr);
            }else success('stdout: ' + stdout);
        });
    })
    runSh.then(function(result) {
        res.end(result.toString());
    }).catch(function(result){
        res.end(result.toString());
    })
});


module.exports = router;
