var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection(global.gConfig.mysql);
router.get('/chat', function(req, res, next) {
	res.send({
        showname : req.session.name_user
    });
})

module.exports = router;
