//* 市民目录主目录的路由设置模块，主要将areas里的各个项导入controller的其他部分

var express = require('express');
var router = express.Router();
var path=require('path');
var index_controll=require(path.join(__dirname,'controller','index_controll'));
var userinfo=require(path.join(process.cwd(),'user_view','controller','userinfo'));
var login_controller=require(path.join(__dirname,'controller','login_controller'));
var menu_controller=require(path.join(__dirname,'controller','menu_controller'));



router.use('/',index_controll);
router.use('/login',login_controller);
router.use('/user_menu',menu_controller);
// router.use('/user_info',userinfo);
module.exports = router;



