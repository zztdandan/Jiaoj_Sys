var easy_mysql = require("../mydb/easy_mysql");

var em = new easy_mysql("user_warning");

var read_user_warning = function (req,res,next) {
    var userid=1;
    var strQuery = "select * from user_warning where user_id='"+userid+"'";
    em.query(strQuery, function (err, rows){

        if (err) {
            throw err;
        }
     req.read_user_warning=rows;
     next();
    });
};

function user_warning(){
    this.read_user_warning=read_user_warning;
}
module.exports = user_warning;
