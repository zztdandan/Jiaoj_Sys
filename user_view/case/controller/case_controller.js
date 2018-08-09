const express = require('express');
const router = express.Router();
const path = require('path');
const fromdata = require('formidable');
const moment = require('moment');
const case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'));
const case_progress_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_progress_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
var user_info_model = require(path.join(process.cwd(), 'menu', 'model', 'user_info_model'));
router.get('/', function (req, res, _next) {
	console.log('case_controller');
	//该流程的流程id
	var node_id = req.query.id;

	case_node_model.read_node_by_id(node_id, function (node) {
		//根据业务节点所需事情不同，渲染不同页面。某些特殊节点，需要的不是渲染页面，是跳转，也一体执行跳转redirect
		//注意，该页面不负责渲染url，该是哪个url是由case?id=,progress=决定的，和渲染页面选择无关
		switch (node.node_type) {
			case 'USER_FORM_SUBMIT': {
				res.render(path.join('user_view', 'case', 'view', 'case_USER_FORM_SUBMIT.ejs'));
				break;
			}
			case 'ADMIN_VERI_SUBMIT': {
				res.render(path.join('user_view', 'case', 'view', 'case_ADMIN_VERI_SUBMIT.ejs'));
				break;
			}
			case 'USER_PAY': {
				res.render(path.join('user_view', 'case', 'view', 'case_USER_PAY.ejs'));
				break;
			}
			case 'USER_MSG_CHECK': {
				res.render(path.join('user_view', 'case', 'view', 'case_USER_MSG_CHECK.ejs'));
				break;
			}
			case 'ADMIN_PAY_CHECK': {
				res.render(path.join('user_view', 'case', 'view', 'case_ADMIN_PAY_CHECK.ejs'));
				break;
			}
			default: { res.end(); }
		}

	});


});


router.get('/getUserSubForm', function (req, res, _next) {
	var case_node_id = req.query.case_node_id;
	case_node_model.read_node_by_id(case_node_id, function (node) {
		var res_json = JSON.parse(node.node_detail);
		res.json(res_json);
	});


});
router.post('/user_form_submit', function (req, res, _next) {
	var form = new fromdata.IncomingForm();
	form.uploadDir = './tmp';
	form.keepExtensions = true;
	//转化为formidable后的处理办法
	form.parse(req, function (_err, fields, _file) {
		if (typeof (fields.case_node_id) == 'undefined') {
			throw new Error('表单不包含合理字段无法提交');
		}
		//数据全在fields里面，具体哪些字段，可读取case_node表。
		// console.log(fields);
		//根据表单的node信息读取node
		case_node_model.read_node_by_id(fields.case_node_id, function (node) {
			var node_detail=JSON.parse(node.node_detail);
			if (typeof (node_detail.Return_json) == 'undefined') {
				throw new Error('node读取失败或case_node_detail设置不合理');
			}
			var returnjson_form = node_detail.Return_json.form;
			// console.log(returnjson_form);
			//这是同步函数
			returnjson_form.forEach(function (element) {
				if (typeof (fields[element.id]) != undefined) {
					element.value = fields[element.id];
				}
				//returnjson_form构建完毕，添加一些必要项后压入content.status和history
			});
			//cookie读取用户
			if (typeof (req.cookies.token) == 'undefined') { res.redirect('/login'); }
			user_info_model.get_user_by_token(req.cookies.token, function (user_json) {
				//获得用户名
				var user_id = user_json.userid;
				//已经获得return_json，现在根据节点不同属性做不同操作
				if (node.node_cate == 'start') {
					//由于是新的，所以需要新建节点再改content等
					//* 节点信息在前面已经获得过
					//使用init函数类获得结果
					case_progress_model.init_new_case(node, user_id, function (new_progress) {
						//先获得rec_id
						//content填写。
						//content包括：history历史数组，status当前json（只用于给下一步传值）
						var content = case_progress_model.create_new_progress_content(returnjson_form, user_id);
						case_progress_model.update_case_progress(new_progress.rec_id, node.rec_id, JSON.stringify(content), function (rows) {
							if (rows == 0) { throw new Error('没有更新数据'); }
							// 更新完成，回传json
							res.json(csexception.new.jsonreturn());
						});
					});


				}
				else if (node.node_cate == 'end') {
					//如果是终止节点，更新progress后不移动node
					if (typeof fields.cate_progress_id == 'undefined') {
						throw new Error('不是发起申请,表单却没有case_progress_id');
					}
					case_progress_model.find_case_progress_by_id(fields.cate_progress_id, function (case_progress) {

						var modified_progress = case_progress_model.update_progress_nosave_hasreturn(case_progress, case_progress.node_id, user_id, returnjson_form);
						case_progress_model.update_case_progress(modified_progress.rec_id, modified_progress.node_id, modified_progress.content, function (rows) {
							if (rows == 0) { throw new Error('没有更新数据'); }
							// 更新完成，回传json
							//这个是个工厂类，回传正确的json
							res.json(csexception.new.jsonreturn());
						});
					});
					// console.log('end');

				} else if (node.node_cate == 'veri') {
					console.log('veri');
				}
			});
			//判断该node性质，如果是新节点，则新建一个case_progress，如果不是新节点，则寻找case_progress
			// console.log(returnjson_form);
		});
	});
});
module.exports = router;

