var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('admin_menu_controller');

    res.end();
});
module.exports = router;