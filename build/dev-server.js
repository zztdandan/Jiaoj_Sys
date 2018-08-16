require('./check-versions')();

var config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require('opn');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.conf');
//*设置引用
var domain = require('domain');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ejs = require('ejs');


// default port where dev server listens for incoming traffic
var port = config.dev.port;//8080
// automatically open browser, if not set will be false
var autoOpenBrowser =true;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(.bodyParser({uploadDir:'./tmp'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});




//设定全局视图解析引擎
//让html调用ejs引擎（等于html可以写ejs）
app.engine('html', ejs.__express);
//设定views目录为全局，调用views将从根目录开始写路径
app.set('views', path.join(__dirname, ''));



var routes = require(path.join(process.cwd(), 'routes', 'index'));
routes(app);


app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// // render the error page
	err.status = err.status || 500;

	res.render('views/error.ejs', { 'errMsg': err.message, 'stat': err.status });
});

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

process.on('uncaughtException', function (err) {

	//所以这里的回调你不要妄想太多,打算打印一下错误信息还是可以的 
	console.error('uncaughtException ERROR');
	if (typeof err === 'object') {
		if (err.message) {
			console.error('ERROR: ' + err.message);
		}
		if (err.stack) {
			console.error(err.stack);
		}
	} else {
		console.error('argument is not an object');
	}


	//然后你还可以做一些手脚,优雅的退出

});
console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri);
  }
  _resolve();
});

var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
