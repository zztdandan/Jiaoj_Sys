var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));

var token=function(){}
 token.token_decrypto=function(crypto, req, next, res) {
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
}


//token加密
token.crypto_token=function(row, crypto, next) {
    var curDate = new Date();
    var startDate = new Date(curDate.setDate(curDate.getDate() + 1));
    var a_token = JSON.stringify({ "phone": row.FORIEGN_PHONENUM, "time": startDate.getTime(), "userid": row.REC_ID });
    crypto.cipher(crypto.algorithm, crypto.key, a_token, function (res) {
        next(true, res);
    });
}

module.exports=token;