var easy_mysql = require('easy_mysql');
easy_mysql.config({
    'host':'140.143.26.135',
    'port':'3306',
    'database': 'jiaojdb',
    'user': 'zztnode',
    'password':'ZZTdan~7758521'
});

module.exports=easy_mysql;