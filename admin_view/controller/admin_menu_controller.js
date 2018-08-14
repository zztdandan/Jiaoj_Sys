var express = require('express');
var router = express.Router();
var path = require('path');
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));

var admin_menu_model = require(path.join(process.cwd(), 'admin_view', 'model', 'admin_menu_model'));
router.get('/', function (req, res, next) {
    console.log('admin_menu_controller');

    res.render(path.join('admin_view', 'view', 'menu', 'index.ejs'));
});
//获得左侧树形列表
router.get('/sidefunction_list', function (req, res, next) {
    console.log('获得左侧树形列表');
    admin_menu_model.read_admin_menu(function (data) {
        res.json(new csexception(true,'success',data));
    });
});
module.exports = router;