var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));





var user_info_model = function () {

    this.read_user_info = function (req, res, next) {
        var em = new easy_mysql("foriegn_user");
        em.query("select * from foriegn_user", function (err, rows) {

            if (err) {
                throw err;
            }
            req.read_user_menu = rows;
            next();
        });

    }
    this.check_user_login = function (phone, pwd, next) {
        var em = new easy_mysql("foriegn_user");
        var sql = "select * from foriegn_user where FORIEGN_PHONENUM= '" + phone + "' and PWD= '" + pwd + "'";
        em.query(sql, function (err, rows) {

            if (err) {
                throw err;
            }
            if (rows.length == 0) {
                next(false, null);
            }
            else {
                next(true, rows[0])
            }

        });
    }
    this.check_and_login_user = function (phone, pwd, next) {
        var path = require('path');
        var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
        this.check_user_login(phone, pwd, function (bol, row) {
            if (!bol) {
                next(bol);
            }
            else {
                var curDate = new Date();
                var startDate = new Date(curDate.setDate(curDate.getDate() + 1));
                var a_token = JSON.stringify({ "phone": row.FORIEGN_PHONENUM, "time": startDate.getTime() });
                crypto.cipher(crypto.algorithm, crypto.key, a_token, function (res) {
                    next(true, res);
                })
            }


        });
    }

    this.get_user_by_token = function (token, next) {

        crypto.decipher(crypto.algorithm, crypto.key, token, function (decrypted) {
            var user_info_json = JSON.parse(decrypted);
            var phnum = user_info_json.phone;
            var em = new easy_mysql("foriegn_user");
            var sql = "select * from foriegn_user where FORIEGN_PHONENUM=" + phnum;
            em.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    if (rows.length == 0) {
                        throw err;
                    }
                    next(rows[0]);
                }

            })
        });
    }
           
        


}



    module.exports = user_info_model;