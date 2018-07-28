var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next) {
  res.render("user_view/case_router/case.ejs");
  
})

module.exports=router;