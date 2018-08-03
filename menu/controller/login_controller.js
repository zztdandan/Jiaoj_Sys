var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var user_info_model = require('../model/user_info_model');
var cookieparser = require('cookie-parser');

//get=登陆页面
router.get('/', function (req, res, next) {

    res.render('menu/view/login.ejs');
});


//post=登陆信息发送

router.post('/', function (req, res, next) {

    user_info_model.check_and_login_user(req.body.phone_num, req.body.pwd, function (bol, token) {
        if (bol) {
            res.cookie("token", token, { maxAge: 59 * 60 * 24 * 1000 });//注册时间为23小时59分
            res.json({ "bol": true });
        }
        else {
            res.clearCookie("token");
            res.json({ "bol": false });
        }

    });

    // res.render('menu/view/login.ejs');
});

module.exports = router;