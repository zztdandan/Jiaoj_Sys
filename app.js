//*设置引用
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ejs = require('ejs');

//using express
var express = require('express');
var app = express();

var domain = require('domain');

app.use(logger('dev'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(.bodyParser({uploadDir:'./tmp'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

//在express里面允许所有请求
// 允许所有的请求形式 
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//设定全局视图解析引擎
//让html调用ejs引擎（等于html可以写ejs）
app.engine('html', ejs.__express);
//设定views目录为全局，调用views将从根目录开始写路径
app.set('views', path.join(__dirname, 'views'));


//这个方法使得所有错误都不会crash，保证运行环境程序正确运行
// app.use(function (req, res, next) {
// 	var reqDomain = domain.create();
// 	reqDomain.on('error', function (err) {  // 下面抛出的异常在这里被捕获,触发此事件
// 		console.log(err);
// 		res.render('views/error.ejs', { 'errMsg': err.message, 'stat': err.status });           // 成功给用户返回了 500
// 	});
// 	reqDomain.run(next);
// });

//* 用routes/index.js分包路由
var routes = require(path.join(process.cwd(), 'routes', 'index'));
routes(app);
//链接sql

// //设置router
// app.use('/', defaultRouter);
// app.use('/index', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// // render the error page
	err.status = err.status || 500;

	res.render('views/error.ejs', { 'errMsg': err.message, 'stat': err.status });
});




module.exports = app;
