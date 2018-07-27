var express = require('express');
var router = express.Router();
var addon=require('../back_case/test');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
});


router.post('/', function(req, res, next) {
 
  // 获取参数
  var query = req.body;
var c=addon.afunc();
var b=addon.b;
  res.json(query);
  res.end();
});
module.exports = router;
