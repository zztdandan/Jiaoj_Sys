var path = require('path');
var express = require('express');
var router = express.Router();
var cookieparser = require('cookie-parser');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
var admin_login_user_model=require(path.join(process.cwd(),'admin_view','model','admin_login_user_model'));

router.get('*', function (req, res, next) {
    if (req.path == '/login') {
        next();
    }
     //!注意，这里不用else，会重复渲染header而报错，一定保证res后面有任何其他函数!因为next是回调函数，所以会先运行后面的。如果没有else就会直接跳到下一行运行，有else就直接跳到结尾
    else {
        //如果没有任何登陆信息
        if (typeof (req.cookies.admintoken) == 'undefined') {
            //没有任何回传信息
            if (typeof (res.query) == 'undefined') {
                res.query = {};
            }
            res.query.postbackurl = req.originalUrl;
            // 没有cookie,跳转到登陆
            res.redirect('/admin_view/login?rs=nopass');
        }
        //有admintoken值
        //!注意，这里不用else，会重复渲染header而报错，一定保证res后面有任何其他函数!
        else {
            admin_login_user_model.token_decrypto( req.cookies.admintoken, function (csexception) {
               
                if (csexception.flag) {
                    //! 注意回调函数特性，后面要用else包裹
                    next();
                }
                else {
                    res.redirect('/admin_view/login?rs=wrongpass');
                }
            });
        }

    }




});

router.get('/login', function (req, res, next) {

    console.log(1);

    res.render(path.join('admin_view', 'view', 'login', 'login.ejs'));
});



module.exports = router;