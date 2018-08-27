var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));

var user_info_model = function() {};

//? 原版函数区
user_info_model.read_user_info = function(req, res, next) {
  var em = new easy_mysql('foriegn_user');
  em.query('select * from foriegn_user', function(err, rows) {
    if (err) {
      throw err;
    }
    req.read_user_menu = rows;
    next();
  });
};
user_info_model.check_user_login = function(phone, pwd, next) {
  var em = new easy_mysql('foriegn_user');
  var sql = 'select * from foriegn_user where FORIEGN_PHONENUM= \'' + phone + '\' and PWD= \'' + pwd + '\'';
  em.query(sql, function(err, rows) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      next(new csexception(false, '', {}));
    } else {
      next(new csexception(true, 'success', rows[0]));
    }
  });
};

//通过电话密码获得user是否通过信息
user_info_model.check_and_login_user = function(phone, pwd, next) {
  var path = require('path');
  var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
  user_info_model.check_user_login(phone, pwd, function(csexception) {
    if (!csexception.flag) {
      next(csexception.flag);
    } else {
      user_info_model.crypto_token(csexception.data, crypto, next);
    }
  });
};

//从token中取出user_info结构体
user_info_model.get_user_by_token = function(token, next) {
  var b = new Object();
  crypto.decipher(crypto.algorithm, crypto.key, token, function(decrypted) {
    b.decrypted = decrypted;
    var user_info_json = JSON.parse(b.decrypted);
    next(user_info_json);
  });
};

//user_token加密
user_info_model.crypto_token = function(row, crypto, next) {
  var curDate = new Date();
  var startDate = new Date(curDate.setDate(curDate.getDate() + 1));
  var a_token = JSON.stringify({ phone: row.FORIEGN_PHONENUM, time: startDate.getTime(), userid: row.REC_ID });
  crypto.cipher(crypto.algorithm, crypto.key, a_token, function(res) {
    next(true, res);
  });
};

//user_token解密，兼任判定函数
user_info_model.token_decrypto = function(token, next) {
  crypto.decipher(crypto.algorithm, crypto.key, token, function(decrypted) {
    try {
      var user_info_json = JSON.parse(decrypted);
      var that_time = user_info_json.time;
      var this_time = new Date().getTime();
      if (that_time <= this_time) {
        //! 注意回调函数特性，后面要用else包裹
        next(new csexception(false, 'failure_outetime', {}));
      } else {
        next(new csexception(true, 'success', user_info_json));
      }
    } catch (err) {
      next(new csexception(false, 'decry_wrong', err));
    }
  });
};

//Promise重构函数区
user_info_model.read_user_info_pro = function(user_rec_id,next) {
 
    var em = new easy_mysql('foriegn_user');
    em.where('REC_ID= ' + user_rec_id).find(function(data) {
      next(data);
    });
  
};

//从token中取出user_info结构体
user_info_model.get_user_by_token_pro = function(token) {

  return new Promise(function(resolve,reject){

    var b = new Object();
    crypto.decipher(crypto.algorithm, crypto.key, token, function(decrypted) {
      b.decrypted = decrypted;
      var user_info_json = JSON.parse(b.decrypted);
      resolve(user_info_json);
    });
  });
  
};


module.exports = user_info_model;
