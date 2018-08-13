var path = require('path');
var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
// var data_dic_model = require(path.join(process.cwd(), 'admin_view', ''));




var admin_menu_model = function () {

};
admin_menu_model.read_admin_menu = function (next) {
    var em = new easy_mysql('admin_menu');
    em.query('select * from admin_menu', function (err, rows) {

        if (err) {
            throw err;
        }
        rows;
        next(rows);
    });

};
// admin_menu_model.read_user_menu_dic = function (next) {
//     data_dic_model.find_list_by_cname('业务大类', function (list) {
//         next(list);
//     });

// };


module.exports = admin_menu_model;
