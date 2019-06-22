var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next){
  if(!req.files || req.session.is_login != 1) {
    res.send({
      status: false,
      message: 'No file uploaded or not login'
    });
  } else {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let upload_file = req.files.customfile;
    let prob_id = req.body.prod_id;
    console.log(prob_id);
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    upload_file.mv('./uploaded/' + prob_id + "_" + req.session.name_id+".cpp");
    //send response
  }
  res.redirect('problems');
});


module.exports = router;
