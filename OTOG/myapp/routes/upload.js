var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next){
  if(!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
  } else {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let upload_file = req.files.customfile;

    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    upload_file.mv('./uploaded/' + upload_file.name);
    //send response
  }
  res.redirect('problems');
});


module.exports = router;
