var express = require('express');
var router = express.Router();
var path = require('path');
var fromdata = require('formidable');
var case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'))
router.get('/', function (req, res, next) {
  console.log('case_controller');
  //该流程的流程id
  var node_id = req.query.id;

  case_node_model.read_node_by_id(node_id, function (node) {
    //根据业务节点所需事情不同，渲染不同页面。某些特殊节点，需要的不是渲染页面，是跳转，也一体执行跳转redirect
    switch (node.node_type) {
      case "USER_FORM_SUBMIT": {
        res.render(path.join("user_view", "case", "view", "case_USER_FORM_SUBMIT.ejs"));
        break;
      }
      case "ADMIN_VERI_SUBMIT": {
        res.render(path.join("user_view", "case", "view", "case_ADMIN_VERI_SUBMIT.ejs"));
        break;
      }
      case "USER_PAY": {
        res.render(path.join("user_view", "case", "view", "case_USER_PAY.ejs"));
        break;
      }
      case "USER_MSG_CHECK": {
        res.render(path.join("user_view", "case", "view", "case_USER_MSG_CHECK.ejs"));
        break;
      }
      case "ADMIN_PAY_CHECK": {
        res.render(path.join("user_view", "case", "view", "case_ADMIN_PAY_CHECK.ejs"));
        break;
      }
      default: { res.end(); }
    }

  });


})


router.get('/getUserSubForm', function (req, res, next) {
  var case_node_id = req.query.case_node_id;
  case_node_model.read_node_by_id(case_node_id, function (node) {
    var res_json = JSON.parse(node.node_detail);
    res.json(res_json);
  });


});
router.post('/user_form_submit',function(req,res,next){
  var form = new fromdata.IncomingForm();
  form.uploadDir = './tmp';
  form.keepExtensions = true;
  //转化为formidable后的处理办法
  form.parse(req, function (err, fields, file) {
    console.log(req.body);
  });
 
})
module.exports = router;