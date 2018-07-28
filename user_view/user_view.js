var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('case',require('./case/case_router'));
router.get('/', function(req, res, next) {
  
});
router.use('case',require('./case/case_router'));
module.exports = router;
