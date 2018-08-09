var express = require('express');
var router = express.Router();
var path=require('path');
var menu_controller=require(path.join(__dirname,'controller','admin_menu_controller'));




/* GET users listing. */
router.use('/',menu_controller);
module.exports = router;
