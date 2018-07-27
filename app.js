//*设置引用
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser');
var logger = require('morgan');
//using ejs 引擎
var ejs = require('ejs'); 
//using express
var express = require('express');


//获取route文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var defaultRouter = require('./routes/default');

var app = express();

// view engine setup
//让html调用ejs引擎
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
 app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//在express里面允许所有请求
// 允许所有的请求形式 
app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//设置router
app.use('/', defaultRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.ejs');
});



module.exports = app;
