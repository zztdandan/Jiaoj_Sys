var express = require('express');
var router = express.Router();
var path = require('path');
var admin_menu_model = require(path.join(process.cwd(), 'admin_view', 'model', 'admin_menu_model'));
const case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'));

//审核目录页面进入
//读取参数为case,意思是case_id
router.get('/index', function (req, res, next) {
    //渲染页面
    console.log('/admin_view/veri/index');

    res.render(path.join('admin_view', 'view', 'veri', 'index.ejs'));
});
//获得左侧树形列表
router.get('/sidefunction_list', function (req, res, next) {
    console.log('获得左侧树形列表');
    admin_menu_model.read_admin_menu(function (data) {
        res.json(data);
    });
});
//这个页面的渲染取决于取回来的progress的值，如果是个开始节点，则取决于
router.get('/detail', function (req, res, next) {
    //渲染页面
    console.log('/admin_view/veri/detail');
    var case_node_id = req.query.node_id;
    case_node_model.read_node_by_id(case_node_id, function (node) {


    });
   
});


module.exports = router;