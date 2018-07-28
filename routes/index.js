var express = require('express');
var router = express.Router();
//using ejs 引擎



module.exports = function (app) {

  // 分发user模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现
  var usersRouter = require('../user_view/user_view');
  var defaultRouter = require('../admin_view/admin_view');
  var menuRouter = require('../menu/menu_view');



  app.use('/admin_view', usersRouter);
  app.use('/user_view', defaultRouter);
  app.use('/', menuRouter);
};
