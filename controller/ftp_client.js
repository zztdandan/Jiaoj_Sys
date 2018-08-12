//ftp函数调取，需要初始化
var client = require('ftp');
var fs = require('fs');
var concat = require('concat-stream');
var ftp_config = require('./ftp_config');
var ftp_client = function () {


    //path:需要下载的文件的完整地址，next:回调函数
    this.Download = function (path, next) {
        var c = new client();
        c.on('ready', function () {

            c.get(path, function (err, stream) {

                if (err) throw err;

                stream.once('close', function () { c.end(); });
                var reverseStream = concat(function (buffer) {
                    //buffer
                    next(buffer);
                });

                stream.pipe(reverseStream);

            });

        });
        c.connect(ftp_config);
    };
    //buffer:图片内容缓存,path:图片存储的ftp地址(完整，包括文件名和后缀),next:回调函数
    this.upLoad = function (buffer, path, next) {


        var c = new client();
        var filepath =path.substring(0, path.lastIndexOf('/'));

        c.on('ready', function () {
            //扫描一遍目录，如果没有这个目录则新建
            c.list(filepath, function (err, list) {
                if (err||list.length==0) {
                    //此处参数true 递归创建目录，可创建多级
                    c.mkdir(filepath, true, function (err) {
                        if (err) throw err;
                        c.put(buffer, path, function (err) {

                            if (err) throw err;
        
                            c.end();
                            next();
                        });
                    });
                }
                else{
                    c.put(buffer, path, function (err) {

                        if (err) throw err;
    
                        c.end();
                        next();
                    });
                }

              

            });


        });
        c.connect(ftp_config);
    };



};

module.exports = ftp_client;