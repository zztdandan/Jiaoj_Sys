var easy_mysql = require(process.cwd()+'/mydb/easy_mysql');



var read_user_menu_fun=function(req,res,next){
    var em = new easy_mysql("user_menu");
    em.query("select * from user_menu", function (err, rows){
        
        if (err) {
            throw err;
        }
        req.read_user_menu=rows;
     next();
    });
    
};

var user_menu=function(){
  
    this.read_user_menu=read_user_menu_fun;
}



module.exports = user_menu;
