var express = require('express');
var router = express.Router();
var path = require('path');
var admin_menu_model = require(path.join(process.cwd(), 'admin_view', 'model', 'admin_menu_model'));
var case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'));
var case_node_type_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_type_model'));
const case_progress_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_progress_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
const fromdata = require('formidable');
var user_info_model = require(path.join(process.cwd(), 'menu', 'model', 'user_info_model'));
var Enumerable = require('linqjs');
//审核目录页面进入
//读取参数为case,意思是case_id
router.get('/index', function (req, res, next) {
    //渲染页面
    console.log('/admin_view/veri/index');

    res.render(path.join('admin_view', 'view', 'veri', 'index.ejs'));
});
//获得这个审核节点所有progress的进度信息
router.get('/case_progress_list', function (req, res, next) {
    console.log('获得这个case的所有progress');
    var case_id = req.query.case_id;
    var start_time = req.query.start_time;
    var end_time = req.query.end_time;
    case_progress_model.find_progress_list_by_case_id(case_id, function (data) {
        try {
            var returndata = Enumerable.from(data).where(function (x) { return (x.LAST_TIME >= start_time && x.LAST_TIME <= end_time); })
                .select(function (x) { return x; });
            res.json(new csexception(true, 'success', returndata));
        }
        catch(e){
            res.json(new csexception(false, 'case_progress_model.find_progress_list_by_case_id出现问题', {}));
       }
    });
});
router.get('/case_node_progress_list', function (req, res, next) {
    console.log('获得这个case_node的所有progress');
    var case_node_id = req.query.case_node_id;
    var start_time = req.query.start_time;
    var end_time = req.query.end_time;
    case_progress_model.find_progress_list_by_case_node_id(case_node_id, function (data) {
        try {
        var returndata = Enumerable.from(data).where(function (x) { return (x.LAST_TIME >= start_time && x.LAST_TIME <= end_time); })
            .select(function (x) { return x; });
        res.json(new csexception(true, 'success', returndata));
        }
        catch(e){
            res.json(new csexception(false, 'case_progress_model.find_progress_list_by_case_id出现问题', {}));
       }
    });
});
//这个页面的渲染取决于取回来的progress的值，如果是个开始节点，则取决于case_node值。总之详细渲染是vue的事，后端只负责按照数据库结构跳转
router.get('/detail', function (req, res, next) {
    //渲染页面
    console.log('/admin_view/veri/detail');
    var case_node_id = req.query.node_id;
    case_node_model.read_node_by_id(case_node_id, function (node) {
        //读取node_type获取渲染页面地址
        case_node_type_model.get_type_by_name(case_node_id.node_type, function (node_type) {
            console.log(node_type);
            res.render(node_type.RENDER_URL);
        });

    });

});
//获得该node的详情信息
router.get('/node_detail', function (req, res, next) {
    var case_node_id = req.query.case_node_id;
    case_node_model.read_node_by_id(case_node_id, function (node) {
        var res_json = JSON.parse(node.node_detail);
        res.json(new csexception(true, 'success', res_json));
    });
});
//获得该case_progress的现状数据
router.get('/get_progress_status', function (req, res, next) {

    var case_progress_id = req.query.case_progress_id;
    case_progress_model.find_case_progress_by_id(case_progress_id, function (case_progress) {
        var res_json = JSON.parse(case_progress.content);
        res.json(new csexception(true, 'success', res_json.status));
    });
});
//审核下一步操作
router.post('/progress_post_veri', function (req, res, _next) {
    var form = new fromdata.IncomingForm();
    form.uploadDir = './tmp';
    form.keepExtensions = true;
    //转化为formidable后的处理办法
    form.parse(req, function (_err, fields, _file) {
        if (typeof (fields.case_node_id) == 'undefined') {
            throw new Error('表单不包含合理字段无法提交');
        }
        if (typeof (fields.case_progress_id) == 'undefined') {
            throw new Error('表单不包含合理字段无法提交');
        }
        //数据全在fields里面，具体哪些字段，可读取case_node表。
        //请注意默认包含case_node_id而且return_json必须包含
        // console.log(fields);
        //根据表单的node信息读取node
        case_node_model.read_node_by_id(fields.case_node_id, function (this_node) {
            var node_detail = JSON.parse(this_node.node_detail);
            if (typeof (node_detail.Return_json) == 'undefined') {
                throw new Error('node读取失败或case_node_detail设置不合理');
            }
            var returnjson_form = node_detail.Return_json.form;
            if (typeof returnjson_form.case_node_id == 'undefined') {
                throw new Error('回传form不包含case_node_id,设计错误');
            }
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


                //获得当前旧节点的progress实体对象
                case_progress_model.find_case_progress_by_id(fields.case_progress_id, function (case_progress_old) {
                    //判断节点情况
                    if (this_node.node_cate == 'end') {
                        //如果是终止节点这个进入程序是出错的，因为终结节点不会提供新的数据，
                        throw new Error('这个节点无法前进');
                    } else {
                        //由于this_node不是终止节点，所以必然有下一个节点
                        case_node_model.read_next_node_by_this_progress(case_progress_old, function (next_node) {
                            //获得了下一个节点，获得了returnjson，现在来各种改写现有oldprogress		
                            var modified_progress = case_progress_model.update_progress_nosave_hasreturn(case_progress_old, next_node.rec_id, user_id, returnjson_form);
                            //请注意next_node改了两次，但是这是合法的冗余操作，不会造成bug
                            case_progress_model.update_case_progress(modified_progress.rec_id, modified_progress.node_id, modified_progress.content, function (rows) {
                                if (rows == 0) { throw new Error('没有更新数据'); }
                                // 更新完成，回传json
                                //这个是个工厂类，回传正确的json
                                res.json(csexception.new.jsonreturn());
                            });
                            // console.log('end');
                        });
                    }
                });

            });
        });

    });
});
//后台获得下一个节点的case_node实体
router.get('/progress_next_node', function (req, res, next) {
    var this_case_node_id = req.query.case_node_id;
    var condition = '';
    if (typeof req.query.condition != 'undefined') {
        condition = req.query.condition;
    }
    case_node_model.read_next_node_by_this_node_id(this_case_node_id, condition, function (data) {
        res.json(new csexception(true, 'success', data));
    });
});
module.exports = router;