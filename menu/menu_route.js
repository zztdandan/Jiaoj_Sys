//* 市民目录主目录的路由设置模块，主要将areas里的各个项导入controller的其他部分

var express = require('express');
var router = express.Router();
var path=require('path');
var menu_controll=require(path.join(__dirname,'/controller/menu_controll'));
var userinfo=require(path.join(__dirname,'/controller/userinfo'));



router.use('/',menu_controll);
// router.use('/user_info',userinfo);
module.exports = router;



