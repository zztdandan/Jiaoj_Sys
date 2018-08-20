var express = require('express');
var router = express.Router();
var path = require('path');
var user_menu_model = require(path.join(process.cwd(), 'menu', 'model', 'user_menu_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));


router.get('/', function (req, res, next) {
    user_menu_model.read_user_menu(function (menuList) {
        console.log('menu_controller');
       
        res.json( new csexception(true,'suc',menuList));
    });


});


router.get('/dic', function (req, res, next) {
    //获得所有业务大类列表
    user_menu_model.read_user_menu_dic(function (dic_list) {
        // console.log('menu_controller');
  
        res.json( new csexception(true,'suc',dic_list));
    });
});

module.exports = router;