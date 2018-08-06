//ftp函数调取，需要初始化
var client = require('ftp');
var fs = require('fs');
var concat = require('concat-stream');
var ftp_config = require('./ftp_config');
var ftp_client = function () {
    var c = new client();

    //path:需要下载的文件的完整地址，next:回调函数
    this.Download = function (path, next) {
        c.on('ready', function () {

            c.get(path, function (err, stream) {

                if (err) throw err;

                stream.once('close', function () { c.end(); });
                var reverseStream = concat(function (buffer) {
                    //buffer
                    next(buffer);
                })

                stream.pipe(reverseStream);

            });

        });
    }
    //buffer:图片内容缓存,path:图片存储的ftp地址(完整，包括文件名和后缀),next:回调函数
    this.upLoad = function (buffer, path, next) {

        c.on('ready', function () {

            c.put('a', 'foo.remote-copy.jpg', function (err) {

                if (err) throw err;

                c.end();

            });


        });
        c.connect(ftp_config);
    }
    c.connect(ftp_config);


}

module.exports = ftp_client;