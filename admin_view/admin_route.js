var express = require('express');
var router = express.Router();
var path=require('path');
var admin_menu_controller=require(path.join(process.cwd(),'admin_view','controller','admin_menu_controller'));
var admin_login_controller=require(path.join(process.cwd(),'admin_view','controller','admin_login_controller'));



/* GET users listing. */
router.get('*',admin_login_controller);
router.use('/',admin_menu_controller);
module.exports = router;
