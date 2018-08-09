var easy_mysql = require(process.cwd()+'/mydb/easy_mysql');





var user_menu=function(){

};
user_menu.read_user_menu=function(next){
    var em = new easy_mysql('user_menu');
    em.query('select * from user_menu', function (err, rows){
        
        if (err) {
            throw err;
        }
        rows;
     next(rows);
    });
    
};


module.exports = user_menu;
