var express = require('express');
var router = express.Router();
var path=require('path');
var case_controller=require('./case/controller/case_controller');
var case_start_controller=require('./case/controller/case_start_controller');
var userinfo=require(path.join(process.cwd(),'user_view','controller','userinfo'));

/* GET home page. */
//处理各项事物申请
router.use('*',userinfo);
router.use('/case',case_controller);
router.use('/case_start',case_start_controller);
// router.use('/', user_info);

module.exports = router;
