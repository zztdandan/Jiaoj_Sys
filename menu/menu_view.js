var express = require('express');
var router = express.Router();
var user_menu = require("../mydb/user_menu");
var user_warning = require("../mydb/user_warning");
router.get('/index', function (req, res, next) {

    res.render('menu/menu_app.ejs');

});
//读取用户列表
router.use('/',new user_menu().read_user_menu);
//读取用户推送通知
router.use('/',new user_warning().read_user_warning);
//首页controller
router.get('/', function (req, res, next) {
   var  warningInfo=null;
    if(req.read_user_warning.length!=0){
        warningInfo=req.read_user_warning;
    }
    var menuList=req.read_user_menu;
            console.log("1");
            res.render('menu/menu_app.ejs', { "menuList": menuList, "warning": warningInfo });

   
})

module.exports = router;




////以前用法
 //回调法获得用户的业务列表    
    // new user_menu().read_user_menu(function (menuList) {
    //     //回调法获得用户通知信息
    //     var user_id=2;
    //     new  user_warning().read_user_warning(user_id, function (warningInfo) {
    //         if (warningInfo.length==0) {
    //             warningInfo = null;
    //         }
    //         console.log(rows);
    //         console.log("1");
    //         res.render('menu/menu_app.ejs', { "menuList": menuList, "warning": warningInfo });

    //     })

    // })