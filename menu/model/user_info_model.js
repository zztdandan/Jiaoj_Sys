var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));





var user_info_model = function () { };

user_info_model.read_user_info = function (req, res, next) {
    var em = new easy_mysql('foriegn_user');
    em.query('select * from foriegn_user', function (err, rows) {

        if (err) {
            throw err;
        }
        req.read_user_menu = rows;
        next();
    });

};
user_info_model.check_user_login = function (phone, pwd, next) {
    var em = new easy_mysql('foriegn_user');
    var sql = 'select * from foriegn_user where FORIEGN_PHONENUM= \'' + phone + '\' and PWD= \'' + pwd + '\'';
    em.query(sql, function (err, rows) {

        if (err) {
            throw err;
        }
        if (rows.length == 0) {
            next(false, null);
        }
        else {
            next(true, rows[0]);
        }

    });
};
user_info_model.check_and_login_user = function (phone, pwd, next) {
    var path = require('path');
    var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
    this.check_user_login(phone, pwd, function (bol, row) {
        if (!bol) {
            next(bol);
        }
        else {
            user_info_model.crypto_token(row, crypto, next);
        }


    });
};

user_info_model.get_user_by_token = function (token, next) {
    var b = new Object();
    crypto.decipher(crypto.algorithm, crypto.key, token, function (decrypted) {
        b.decrypted = decrypted;
        var user_info_json = JSON.parse(b.decrypted);
        next(user_info_json);
    });
    


};



//token加密
user_info_model.crypto_token=function(row, crypto, next) {
    var curDate = new Date();
    var startDate = new Date(curDate.setDate(curDate.getDate() + 1));
    var a_token = JSON.stringify({ 'phone': row.FORIEGN_PHONENUM, 'time': startDate.getTime(), 'userid': row.REC_ID });
    crypto.cipher(crypto.algorithm, crypto.key, a_token, function (res) {
        next(true, res);
    });
};

//token解密
user_info_model.token_decrypto=function(crypto, req, next, res) {
    crypto.decipher(crypto.algorithm, crypto.key, req.cookies.token, function (decrypted) {
        var user_info_json = JSON.parse(decrypted);
        var that_time = user_info_json.time;
        var this_time = new Date().getTime();
        if (that_time >= this_time) {
            next();
        }
        else {
            res.redirect('/login');
        }
    });
};
module.exports = user_info_model;
