var express = require('express');
var router = express.Router();
var path = require('path');
var user_menu = require(path.join(process.cwd(), 'menu', 'model', 'user_menu_model'));



router.get('/', function (req, res, next) {
    user_menu.read_user_menu(function (menuList) {
        console.log('menu_controller');
        res.json(menuList);
    });


});

module.exports = router;