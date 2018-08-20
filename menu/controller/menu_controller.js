var express = require('express');
var router = express.Router();
var path = require('path');
var user_menu_model = require(path.join(process.cwd(), 'menu', 'model', 'user_menu_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));



//获得menulist
router.get('/', function (req, res, next) {
    user_menu_model.read_user_menu(function (menuList) {
        console.log('menu_controller');
       
        res.json( new csexception(true,'suc',menuList));
    });


});


//获得业务大类的ntext，在code_desc，由于有多项，所以是直接输出list的。在前台是直接读取dic+list[i].CODE_DESC
router.get('/dic', function (req, res, next) {
    user_menu_model.read_user_menu_dic(function (dic_list) {
        // console.log('menu_controller');
  
        res.json( new csexception(true,'suc',dic_list));
    });
});

module.exports = router;