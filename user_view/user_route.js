var express = require('express');
var router = express.Router();
var path=require('path');
var case_controller=require('./case/controller/case_controller');
var user_info=require(path.join(process.cwd(),'menu','controller','userinfo'));

/* GET home page. */
//处理各项事物申请
router.use('*',user_info);
router.use('/case',case_controller);

// router.use('/', user_info);

module.exports = router;
