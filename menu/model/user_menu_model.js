var path = require('path');
var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var data_dic_model = require(path.join(process.cwd(), 'model', 'data_dic_model'));


var user_menu_model = function () {

};
user_menu_model.read_user_menu = function (next) {
    var em = new easy_mysql('user_menu');
    em.query('select * from user_menu', function (err, rows) {

        if (err) {
            throw err;
        }
        rows;
        next(rows);
    });

};

//获得业务大类的ntext，在code_desc，由于有多项，所以是直接输出list的
user_menu_model.read_user_menu_dic = function (next) {
    data_dic_model.find_list_by_cname('业务大类', function (list) {
        next(list);
    });

};


module.exports = user_menu_model;
