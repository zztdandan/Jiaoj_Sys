var express = require('express');
var router = express.Router();
var path=require('path');
var case_index_model=require(path.join(process.cwd(),'user_view','case','model','case_index_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));

router.get('/',function(req, res, next) {
	console.log('case_start_controller');
	//该该业务在case_index里面的id，用于获取startid
	var id=req.query.id;
	case_index_model.read_start_node(id,function(node){
    
		res.redirect('/user_view/case?id='+node.rec_id);
	});


});

router.get('/get_node',function(req, res, next) {

	//该该业务在case_index里面的id，用于获取startid
	var id=req.query.case_id;
	case_index_model.read_start_node(id,function(node){
		res.json(new csexception(true,'suc',node));
	});


});

module.exports=router;