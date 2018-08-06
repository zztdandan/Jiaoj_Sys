//file_manager表格操作
var path = require('path');
var easy_mysql = require(path.join(process.cwd(), 'mydb', 'easy_mysql'));
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));


var file_manager_model = function () { }


file_manager_model.additem = function (file_manager_entity, next) {
    var em = new easy_mysql("file_manager");
    em.add(file_manager_entity, function (id) {        
        next(id);
    })
}






module.exports = file_manager_model;

