var express = require('express');
var router = express.Router();
var path=require('path');
var user_menu = require("../model/user_menu_model");
var user_warning = require("../model/user_warning_model");


//首页渲染
//读取用户业务目录
router.get('/', new user_menu().read_user_menu);
//读取用户推送通知

//首页controller
router.get('/', function (req, res, next) {
   
    var menuList = req.read_user_menu;
    console.log("首页controller");
    res.render('menu/view/menu_app.ejs', { "menuList": menuList});
});
//首页end




//警告get
// var user_info=require("./userinfo");
// var uvnew=new user_warning(user_info);
var uvnew=new user_warning();
router.get('/user_warning_info', uvnew.read_user_warning);
// router.use('/user_warning_info', uvnew.del_user_warning);
router.get('/user_warning_info', function (req, res, next) {
    var warningInfo = null;
    if (req.read_user_warning!=null) {
        warningInfo = req.read_user_warning;
    }
    res.json(warningInfo);

})
// 警告end

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