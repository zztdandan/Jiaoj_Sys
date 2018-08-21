var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var user_info_model = require('../model/user_info_model');
var cookieparser = require('cookie-parser');
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
//get=登陆页面
router.get('/', function(req, res, next) {
  var path = require('path');
  var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
  console.log('check_token');
  //没有任何登陆信息
  if (typeof req.cookies.token == 'undefined') {
    //没有任何回传信息
    if (typeof res.query == 'undefined') {
      res.query = new Object();
    }
    res.query.postbackurl = req.originalUrl;
    // 没有cookie,跳转到登陆
    res.json(new csexception(false, 'nopass', {}));
  }
  //有token值
  //!注意，这里不用else，会重复渲染header而报错，一定保证res后面有任何其他函数!
  else {
    //!注意 这里传递next到其他模块可能报错，要使用匿名函数在本模块调用next(),在其他模块的next()可能有异意
    user_info_model.token_decrypto(req.cookies.token, function(csexception) {
      if (csexception.flag) {
        //! 注意回调函数特性，后面要用else包裹
        res.json(new csexception(true, 'rightpass', {}));
      } else {
        res.json(new csexception(false, 'wrongpass', {}));
      }
    });
  }
});

//post=登陆信息发送

router.post('/', function(req, res, next) {
  user_info_model.check_and_login_user(
    req.body.phone_num,
    req.body.pwd,
    function(bol, token) {
      if (bol) {
        res.cookie('token', token, { maxAge: 59 * 60 * 24 * 1000 }); //注册时间为23小时59分

        res.json(new csexception(true, 'suc', {}));
      } else {
        res.clearCookie('token');
        res.json(new csexception(false, 'suc', {}));
      }
    }
  );

  // res.render('menu/view/login.ejs');
});

module.exports = router;
