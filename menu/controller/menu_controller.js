var express = require('express');
var router = express.Router();
var path=require('path');
var user_menu = require("../model/user_menu_model");

router.get('/', new user_menu().read_user_menu);

router.get('/', function (req, res,next) {
   
    var menuList = req.read_user_menu;
    console.log("menu_controller");
    res.json(menuList);
});

module.exports=router;