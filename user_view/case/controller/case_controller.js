var express = require('express');
var router = express.Router();
var path=require('path');

router.get('/',function(req, res, next) {
  console.log('case_controller');
  //该流程的流程id
  var id=req.query.id;

  res.render(path.join('user_view','case','view','case.ejs'));
})

module.exports=router;