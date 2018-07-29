var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next) {
  console.log('case_controller');

  res.end();
})

module.exports=router;