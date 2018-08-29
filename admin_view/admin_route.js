var express = require('express');
var router = express.Router();
var path=require('path');
var admin_menu_controller=require(path.join(process.cwd(),'admin_view','controller','admin_menu_controller'));
var admin_login_controller=require(path.join(process.cwd(),'admin_view','controller','admin_login_controller'));
var admin_veri_controller=require(path.join(process.cwd(),'admin_view','controller','admin_veri_controller'));


/* GET users listing. */
// router.get('*',admin_login_controller);
router.use('/',admin_menu_controller);
router.use('/veri',admin_veri_controller);
module.exports = router;
