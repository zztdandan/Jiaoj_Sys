//* 总路由，注册各个area
var path=require("path");
var express = require('express');
var router = express.Router();
//using ejs 引擎



module.exports = function (app) {

  // 分发user模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现
  var user_view = require(path.join(process.cwd(),'user_view','user_route'));
  var admin_view = require(path.join(process.cwd(),'admin_view','admin_route'));
  var menu = require(path.join(process.cwd(),'menu','menu_route'));



  //*管理员area
  app.use('/admin_view', admin_view);
  //*用户area
  app.use('/user_view', user_view);
  //*默认路径归于menu_area
  app.use('/', menu);
};
