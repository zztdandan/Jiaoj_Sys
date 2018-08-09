var path = require('path');
var express = require('express');
var router = express.Router();
var cookieparser = require('cookie-parser');
var user_info_model = require(path.join(process.cwd(), 'menu', 'model', 'user_info_model'));
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));

router.get('*', function (req, res, next) {
    var path = require('path');
    var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
    console.log('check_token');
    //没有任何登陆信息
    if (typeof (req.cookies.token) == 'undefined') {
        //没有任何回传信息
        if (typeof (res.query) == 'undefined') {
            res.query = new Object();
        }
        res.query.postbackurl = req.originalUrl;
        // 没有cookie,跳转到登陆
        res.redirect('/login?rs=nopass');
    }
    //有token值
    //!注意，这里不用else，会重复渲染header而报错，一定保证res后面有任何其他函数!
    else {
        //!注意 这里传递next到其他模块可能报错，要使用匿名函数在本模块调用next(),在其他模块的next()可能有异意
        user_info_model.token_decrypto(req.cookies.token, function (csexception) {
            if (csexception.flag) {
                //! 注意回调函数特性，后面要用else包裹
                next();
            }
            else {
                res.redirect('/login?rs=wrongpass');
            }
        });
    }



});


module.exports = router;
