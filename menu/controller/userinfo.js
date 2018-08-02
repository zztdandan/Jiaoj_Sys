var path = require('path');
var express = require('express');
var router = express.Router();
var cookieparser = require('cookie-parser');
var router = express.Router();

var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));

router.get('*', function (req, res, next) {
    var path = require('path');
    var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));

    //没有任何登陆信息
    if (typeof (req.cookies.token) == "undefined") {
        //没有任何回传信息
        if (typeof (res.query) == "undefined") {
            res.query = new Object();
        }
        res.query.postbackurl = req.originalUrl;
        // 没有cookie,跳转到登陆
        res.redirect('/login');
    }
    //有token值
    //!注意，这里不用else，会重复渲染header而报错，一定保证res后面有任何其他函数!
    else {
        crypto.decipher(crypto.algorithm, crypto.key, req.cookies.token, function (decrypted) {
            var user_info_json = JSON.parse(decrypted);
            var that_time = user_info_json.time;
            var this_time = new Date().getTime();
            if (that_time >= this_time) {
                next();

            }
            else {
                res.redirect('/login');
            }
        });
    }



});


module.exports = router;