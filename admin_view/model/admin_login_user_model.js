var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));



var admin_login_user_model = function () { };
admin_login_user_model.read_admin_info_by_name = function (name, next) {
    var em = new easy_mysql('admin_user');
    var sql = 'select * from admin_user where admin_user_name= \'' + name + '\'';
    em.query(sql, function (err, rows) {
        if (err) {
            throw new Error('admin_login_user_model.read_user_info_by_name 出错');
        }
        if (rows.length == 0) {
            next(new csexception(true, 'fall', {}));
        }
        else {
            next(new csexception(true, 'success', rows[0]));
        }
    });

};

//检查用户名密码
admin_login_user_model.check_admin_login = function (name, pwd, next) {
    var em = new easy_mysql('admin_user');
    var sql = 'select * from admin_user where admin_user_name= \'' + name + '\' and PWD= \'' + pwd + '\'';
    em.query(sql, function (err, rows) {

        if (err) {
            throw err;
        }
        if (rows.length == 0) {
            next(new csexception(true, 'fall', {}));
        }
        else {
            next(new csexception(true, 'success', rows[0]));
        }

    });
};


//检查并将该用户登陆
admin_login_user_model.check_and_login_admin = function (phone, pwd, next) {
    admin_login_user_model.check_user_login(phone, pwd, function (csexception) {
        if (!csexception.flag) {
            next(csexception.flag);
        }
        else {
            admin_login_user_model.crypto_token(csexception.data, crypto, next);
        }


    });
};

//从admin_token的str中取出admin_token结构体
admin_login_user_model.get_user_by_token = function (token, next) {
    var b = new Object();
    crypto.decipher(crypto.algorithm, crypto.key, token, function (decrypted) {
        b.decrypted = decrypted;
        var user_info_json = JSON.parse(b.decrypted);
        next(user_info_json);
    });



};

//admin_token加密,从结构体中得到admin_token
admin_login_user_model.crypto_token = function (row, crypto, next) {
    var curDate = new Date();
    var startDate = new Date(curDate.setDate(curDate.getDate() + 1));
    var a_token = JSON.stringify({ 'name': row.ADMIN_USER_NAME, 'time': startDate.getTime(), 'adminid': row.ADMIN_USER_ID });
    crypto.cipher(crypto.algorithm, crypto.key, a_token, function (res) {
        next(new csexception(true, 'success', res));
    });
};
//admin_token解密
admin_login_user_model.token_decrypto = function (admintoken, next) {

    crypto.decipher(crypto.algorithm, crypto.key, admintoken, function (decrypted) {
        var admin_user_info_json = JSON.parse(decrypted);
        var that_time = admin_user_info_json.time;
        var this_time = new Date().getTime();
        if (that_time >= this_time) {
            //! 注意回调函数特性，后面要用else包裹
            next(new csexception(true, 'failure', {}));
        }
        else {
            next(new csexception(true, 'success', {}));
        }
    });
};

module.exports = admin_login_user_model;
