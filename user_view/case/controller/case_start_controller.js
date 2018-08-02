var express = require('express');
var router = express.Router();
var path=require('path');
var case_index_model

router.get('/',function(req, res, next) {
  console.log('case_start_controller');
  //该该业务在case_index里面的id，用于获取startid
  var id=req.query.id;
  case_index_model.read_start_node(id,function(node){
    
    res.redirect('/user_view/case?id='+node.rec_id);
  });
  res.render(path.join('user_view','case','view','case.ejs'));


})

module.exports=router;