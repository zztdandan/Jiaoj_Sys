var express = require('express');
var router = express.Router();
var path=require('path');
var bodyParser=require('body-parser');
//get=登陆页面
router.get('/', function (req, res, next) {
   
    res.render('menu/view/login.ejs');
});


//post=登陆信息发送

router.post('/', function (req, res, next) {
   
    res.end();
    // res.render('menu/view/login.ejs');
});

module.exports=router;