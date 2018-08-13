
var path = require('path');
var easy_mysql = require(path.join(process.cwd(), 'mydb', 'easy_mysql'));


var data_dic_model=function(){};

//通过code_class的中文名来寻找该list的函数
data_dic_model.find_list_by_cname=function(c_name,next){
    var em = new easy_mysql('data_dic');
    try{
        em.where('CODE_CLASS_CNAME= \''+c_name+'\'').find(function(data){

            next(data);
        });
    }
    catch(e){
        throw new Error('data_dic_model.find_list_by_cname');
    }
};

//通过code_class的code名来寻找该list的函数
data_dic_model.find_list_by_code_class=function(code_class,next){
    var em = new easy_mysql('data_dic');
    try{
        em.where('CODE_CLASS= \''+code_class+'\'').find(function(data){

            next(data);
        });
    }
    catch(e){
        throw new Error('data_dic_model.find_list_by_code_class');
    }
};

module.exports=data_dic_model;