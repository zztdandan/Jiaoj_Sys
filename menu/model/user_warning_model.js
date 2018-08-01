var easy_mysql = require(process.cwd() + "/mydb/easy_mysql");
var cookieparser = require('cookie-parser');
var em = new easy_mysql("user_warning");
var path = require('path');
var user_info_model = require('./user_info_model');
var read_user_warning = function (req, res, next) {
    if (typeof (req.cookies.token) != "undefined") {

        new user_info_model().get_user_by_token(req.cookies.token, function (foreign_user) {
            var userid = foreign_user.REC_ID;
            var strQuery = "select * from user_warning where user_id='" + userid + "'";
            em.query(strQuery, function (err, rows) {

                if (err) {
                    req.read_user_warning = null;
                    throw err;
                }
                if (rows.length != 0) {
                    req.read_user_warning = rows;
                }
                else {
                    req.read_user_warning = null;
                }
                next();
            });

        });

    }
    else {
        req.read_user_warning = null;
        next();
    }


};

function user_warning() {
    this.read_user_warning = read_user_warning;
}
module.exports = user_warning;
