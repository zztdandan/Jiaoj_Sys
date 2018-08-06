var express = require('express');
var router = express.Router();
var path = require('path');
var fromdata = require('formidable');
var util = require('util');
var fs = require('fs');
var ftp_client = require('./ftp_client');
var randomword = require(path.join(process.cwd(), 'logic', 'randomword'));
var moment = require('moment');
var file_manager_model = require(path.join(process.cwd(), 'model', 'file_manager_model'));

//上传处理
//约定上传格式为一个form，该form必须有这个定义：enctype='multipart/form-data'，
//一般情况下，form会包含一个图片文件（有且仅有第一个才会被上传），而且包含一个type字段标明该图片所属
router.post('/uploadpic', function (req, res, next) {
    var form = new fromdata.IncomingForm();
    form.uploadDir = './tmp';
    form.maxFieldsSize = 1024 * 1024;//文件大小限制在1mb
    form.keepExtensions = true;
    //转化为formidable后的处理办法
    form.parse(req, function (err, fields, file) {
        if (err) {
            err.status = 414;
            err.message = "上传功能出错";
            throw err;
        }
        //第一步，获得文件地址
        var tmpfilePath = '';
        var fileSavepath = '';
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if (file.tmpFile) {
            tmpfilePath = file.tmpFile.path;
        } else {
            for (var key in file) {
                if (file[key].path && tmpfilePath === '') {
                    tmpfilePath = file[key].path;
                    break;
                }
            }
        }

        //第二部,判断文件类型是否允许上传
        var fileExt1;
        var fileExt = tmpfilePath.substring(tmpfilePath.lastIndexOf('.'));
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            res.json({ code: -1, message: '此文件类型不允许上传' });
        } else {
            fileExt1 = fileExt.substring(1);
        }

        //第三步，已经获悉文件可以上传，现在读取暂存在tmp里面的文件
        //tmpfilePath:暂存的文件的路径
        fs.readFile(tmpfilePath, function (err, data) {
            //data，已经将暂存文件读入缓存中
            if (err) {
                err.status = 415;

                throw err;
            }
            //指定该ftp存储一系列参数用于存入数据库
            var file_manager = new Object();
            file_manager.REC_ID = randomword(false, 8);
            file_manager.FILE_NAME = filename = randomword(false, 8) + fileExt;
            file_manager.FILE_TYPE = 'ftp';
            file_manager.FTP_CONFIG = JSON.stringify(require('./ftp_config'));
            file_manager.FTP_PATH
            if (typeof (fields.type) != "undefined") {
                fileSavepath = fileSavepath + '/' + fields.type;
            }
            fileSavepath = fileSavepath + '/' + moment().format('YYYYMMDD');
            file_manager.FTP_PATH = fileSavepath + '/' + filename;
            //初始化ftp函数
            var f_c = new ftp_client();
            //上传buffer到ftp
            f_c.upLoad(data, file_manager.FTP_PATH, function () {
                //进入此处代表上传成功（前面已经做过错误处理）
                console.log('upLoaded');
            });
            //回传rec_id到post回执
            file_manager_model.additem(file_manager, function (id) {
                res.json({ "id": file_manager.REC_ID  });
            });
            //删除临时目录中的文件
            fs.unlink(tmpfilePath,function(err)
            {
                if (err) {
                    throw new Error("删除暂存文件失败");
                }
            });
        
        });



    });

});
router.get('/load', function (req, res, next) {

    if (typeof (req.query.id) == "undefined") {//没有指定id
        throw new Error("没有指定id");
    }
    var rec_id = req.query.id;

});

module.exports = router;