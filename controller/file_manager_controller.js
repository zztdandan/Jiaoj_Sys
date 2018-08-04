var express = require('express');
var router = express.Router();
var path=require('path');
var fromdata=require('formidable');
var util = require('util');
var fs = require('fs');


router.post('/upload',function(req,res,next){
    var form = new fromdata.IncomingForm();  
    form.uploadDir = './tmp'; 
    form.parse(req, function(err, fields, files) {  
            console.log('fields',fields);//表单传递的input数据  
            console.log('files',files);//上传文件数据  
            //do somthing......  
    });  

});
module.exports=router;