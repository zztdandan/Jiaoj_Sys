var easy_mysql = require('easy_mysql');
easy_mysql.config({
    'database': 'jiaojdb',
    'user': 'root',
    'password':'7758521'
});

module.exports=easy_mysql;