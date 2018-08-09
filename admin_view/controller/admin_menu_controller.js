var express = require('express');
var router = express.Router();
var path=require('path');

router.get('/', function (req, res, next) {
    console.log('admin_menu_controller');

    res.render(path.join('admin_view','view','menu','index.ejs'));
});
module.exports = router;