var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  
});


router.post('/', function(req, res, next) {
 
  // 获取参数
  var query = req.body;

  res.json(query);
  res.end();
});
module.exports = router;
