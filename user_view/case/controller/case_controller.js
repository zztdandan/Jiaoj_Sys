const express = require('express');
const router = express.Router();
const path = require('path');
const formdata = require('formidable');
// const moment = require('moment');
const case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'));
const case_index_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_index_model'));
const case_progress_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_progress_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
var user_info_model = require(path.join(process.cwd(), 'menu', 'model', 'user_info_model'));
// var case_node_type_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_type_model'));

// router.get('/', function (req, res, _next) {
// 	console.log('case_controller');
// 	//该流程的流程id
// 	var node_id = req.query.node_id;

// 	case_node_model.read_node_by_id(node_id, function (node) {
// 		//读取node_type获取渲染页面地址
// 		case_node_type_model.get_type_by_name(node_id.node_type, function (node_type) {
// 			console.log(node_type);
// 			res.render(node_type.RENDER_URL);
// 		});
// 	});
// });

//* get操作集合
//获得该节点的详细信息，直接获得detail
router.get('/node_detail', function(req, res, _next) {
  var case_node_id = req.query.case_node_id;
  case_node_model.read_node_by_id(case_node_id, function(node) {
    var res_json = JSON.parse(node.node_detail);
    res.json(new csexception(true, 'suc', res_json));
  });
});

//后台获得下一个节点的case_node实体
router.get('/progress_next_node', function(req, res, next) {
  var this_case_node_id = req.query.case_node_id;
  var condition = '';
  if (typeof req.query.condition != 'undefined') {
    condition = req.query.condition;
  }
  case_node_model.read_next_node_by_this_node_id(this_case_node_id, condition, function(data) {
    res.json(new csexception(true, 'success', data));
  });
});
router.get('/node_info', function(req, res, _next) {
  var case_node_id = req.query.case_node_id;
  case_node_model.read_node_by_id(case_node_id, function(node) {
    res.json(new csexception(true, 'suc', node));
  });
});
router.get('/case_progress_history', function(req, res, next) {
  var case_progress_id = req.query.case_progress_id;
  case_progress_model.find_case_progress_by_id(case_progress_id, function(case_progress) {
    var res_json = JSON.parse(case_progress.content);
    res.json(new csexception(true, 'success', res_json.history));
  });
});
router.get('/case_progress', function(req, res, next) {
  var case_progress_id = req.query.case_progress_id;
  case_progress_model.find_case_progress_by_id(case_progress_id, function(case_progress) {
    res.json(new csexception(true, 'success', case_progress));
  });
});
router.get('/case_info', function(req, res, next) {
  var case_id = req.query.case_id;
  case_index_model
    .get_case_info_all_pro(case_id)
    .then(function(case_data) {
      res.json(new csexception(true, 'success', case_data));
    })
    .catch(function(err) {
      console.log('case_index_model.get_case_info_all', err);
    });
});

router.get('/case_progress_by_user', function(req, res, next) {
  var user_id = req.query.user_id;
  case_progress_model.find_progress_list_by_user_pro(user_id).then(list => {
    let a = new Array();
    list.forEach(a_progress => {
      let temp_progress = a_progress;
      temp_progress.CONTENT = JSON.parse(a_progress.CONTENT);
      a.push(temp_progress);
    });
    res.json(new csexception(true, 'success', a));
  });
});

//* post操作集合
//user_form_submit上传controller
router.post('/user_form_submit', function(req, res, _next) {
  var form = new formdata.IncomingForm();
  form.uploadDir = './tmp';
  form.keepExtensions = true;
  //转化为formidable后的处理办法
  form.parse(req, function(_err, fields, _file) {
    if (typeof fields.case_node_id == 'undefined') {
      throw new Error('表单不包含合理字段无法提交');
    }
    //数据全在fields里面，具体哪些字段，可读取case_node表。
    // console.log(fields);
    //根据表单的node信息读取node
    case_node_model.read_node_by_id(fields.case_node_id, function(this_node) {
      var node_detail = JSON.parse(this_node.node_detail);
      if (typeof node_detail.Return_json == 'undefined') {
        throw new Error('node读取失败或case_node_detail设置不合理');
      }

      // 创造return_json作为status
      var returnjson_form = Build_Returnjson_As_Newstatus(node_detail, fields);

      //cookie读取用户
      if (typeof req.cookies.token == 'undefined') {
        res.json(new csexception(false, '失去登陆信息', {}));
        return;
      }
      user_info_model.get_user_by_token_pro(req.cookies.token).then(function(user_info) {
        //获得用户名
        var user_id = user_info.REC_ID;
        //已经获得return_json，现在根据节点不同属性做不同操作
        //?判断该node性质，如果是新节点，则新建一个case_progress，如果不是新节点，则寻找case_progress
        if (this_node.node_cate == 'start') {
          //由于是新的，所以需要新建节点再改content等
          //* 节点信息在前面已经获得过
          //使用init函数类获得结果，此时新的progress已经存入数据库
          case_progress_model.init_new_case(this_node, user_info, function(new_progress) {
            //先获得rec_id
            //创造新的content真信息
            //content包括：history历史数组，status当前json（只用于给下一步传值）
            var content = case_progress_model.create_new_progress_content(returnjson_form, user_id);
            let next_condition = GetconditionByReturnjson(returnjson_form);
            case_node_model.read_next_node_by_this_node_id(this_node.rec_id, next_condition, function(next_node) {
              //升级刚刚新建（并已经保存到数据库）的Progress
              case_progress_model.update_case_progress(
                new_progress.REC_ID,
                next_node.rec_id,
                JSON.stringify(content),
                function(re) {
                  if (typeof re == 'undefined') {
                    throw new Error('没有更新数据');
                  }
                  // 更新完成，回传json
                  res.json(new csexception(true, '数据录入成功', re));
                }
              );
            });
          });
        }
        //?上述蓝描述的else操作
        else {
          //不是新节点，回传数据肯定包含progress_id
          if (typeof fields.case_progress_id == 'undefined') {
            throw new Error('表单不包含合理字段无法提交');
          }
          //获得当前旧节点的progress实体对象
          case_progress_model.find_case_progress_by_id(fields.case_progress_id, function(case_progress_old) {
            if (this_node.node_cate == 'end') {
              //如果是终止节点这个进入程序是出错的，因为终结节点不会提供新的数据，
              throw new Error('这个节点无法前进');
            } else {
              //由于this_node不是终止节点，所以必然有下一个节点
              // 根据return_json判断是否有condition,condition是何值
              let next_condition = GetconditionByReturnjson(returnjson_form);
              case_node_model.read_next_node_by_this_node_id(this_node.rec_id, next_condition, function(next_node) {
                //获得了下一个节点，获得了returnjson，现在来各种改写现有oldprogress
                var modified_progress = case_progress_model.update_progress_nosave_hasreturn(
                  case_progress_old,
                  next_node.rec_id,
                  user_id,
                  returnjson_form
                );
                //请注意next_node改了两次，但是这是合法的冗余操作，不会造成bug
                case_progress_model.update_case_progress(
                  modified_progress.REC_ID,
                  modified_progress.NODE_ID,
                  modified_progress.CONTENT,
                  function(rows) {
                    if (rows == 0) {
                      throw new Error('没有更新数据');
                    }
                    // 更新完成，回传json
                    //这个是个工厂类，回传正确的json
                    res.json(csexception.new.jsonreturn());
                  }
                );
                // console.log('end');
              });
            }
          });
        } //?蓝节点else结束
      });
    });
  });
});

//用户登陆信息上传
router.post('/user_post_form', function(req, res, _next) {
  var form = new formdata.IncomingForm();
  form.uploadDir = './tmp';
  form.keepExtensions = true;
  //转化为formidable后的处理办法
  form.parse(req, function(_err, fields, _file) {
    if (typeof fields.case_node_id == 'undefined') {
      throw new Error('表单不包含合理字段无法提交');
    }
    //数据全在fields里面，具体哪些字段，可读取case_node表。
    // console.log(fields);
    //根据表单的node信息读取node
    case_node_model.read_node_by_id(fields.case_node_id, function(this_node) {
      var node_detail = JSON.parse(this_node.node_detail);
      if (typeof node_detail.Return_json == 'undefined') {
        throw new Error('node读取失败或case_node_detail设置不合理');
      }

      // 创造return_json作为status
      var returnjson_form = Build_Returnjson_As_Newstatus(node_detail, fields);

      //cookie读取用户
      if (typeof req.cookies.token == 'undefined') {
        res.json(new csexception(false, '失去登陆信息', {}));
        return;
      }
      user_info_model.get_user_by_token_pro(req.cookies.token).then(function(user_info) {
        //获得用户名
        var user_id = user_info.REC_ID;

        //已经获得return_json，现在根据节点不同属性做不同操作
        //?判断该node性质，如果是新节点，则新建一个case_progress，如果不是新节点，则寻找case_progress
        if (this_node.node_cate == 'start') {
          //由于是新的，所以需要新建节点再改content等
          //* 节点信息在前面已经获得过
          //使用init函数类获得结果，此时新的progress已经存入数据库
          case_progress_model.init_new_case(this_node, user_info, function(new_progress) {
            //先获得rec_id
            //创造新的content真信息
            //content包括：history历史数组，status当前json（只用于给下一步传值）
            var content = case_progress_model.create_new_progress_content(returnjson_form, user_id);
            //获得该起始节点的下一个节点信息

            let next_condition = GetconditionByReturnjson(returnjson_form);
            case_node_model.read_next_node_by_this_node_id(this_node.rec_id, next_condition, function(next_node) {
              //升级刚刚新建（并已经保存到数据库）的Progress
              case_progress_model.update_case_progress(
                new_progress.REC_ID,
                next_node.rec_id,
                JSON.stringify(content),
                function(re) {
                  if (typeof re == 'undefined') {
                    throw new Error('没有更新数据');
                  }
                  // 更新完成，回传json
                  res.json(new csexception(true, '数据录入成功', re));
                }
              );
            });
          });
        }
        //?上述蓝描述的else操作
        else {
          //不是新节点，回传数据肯定包含progress_id
          if (typeof fields.case_progress_id == 'undefined') {
            throw new Error('表单不包含合理字段无法提交');
          }
          //获得当前旧节点的progress实体对象
          case_progress_model.find_case_progress_by_id(fields.case_progress_id, function(case_progress_old) {
            if (this_node.node_cate == 'end') {
              //如果是终止节点这个进入程序是出错的，因为终结节点不会提供新的数据，
              throw new Error('这个节点无法前进');
            } else {
              let next_condition = GetconditionByReturnjson(returnjson_form);
              case_node_model.read_next_node_by_this_node_id(this_node.rec_id, next_condition, function(next_node) {
                //获得了下一个节点，获得了returnjson，现在来各种改写现有oldprogress
                var modified_progress = case_progress_model.update_progress_nosave_hasreturn(
                  case_progress_old,
                  next_node.rec_id,
                  user_id,
                  returnjson_form
                );
                //请注意next_node改了两次，但是这是合法的冗余操作，不会造成bug
                case_progress_model.update_case_progress(
                  modified_progress.REC_ID,
                  modified_progress.NODE_ID,
                  modified_progress.CONTENT,
                  function(rows) {
                    if (rows == 0) {
                      throw new Error('没有更新数据');
                    }
                    // 更新完成，回传json
                    //这个是个工厂类，回传正确的json
                    res.json(new csexception(true, 'submit_success', {}));
                  }
                );
                // console.log('end');
              });
            }
          });
        } //?蓝节点else结束
      });
    });
  });
});

module.exports = router;

//通过判断returnjson里有无condition键值，赋给condition不同的值
function GetconditionByReturnjson(returnjson_form) {
  let next_condition = null;
  if (returnjson_form.where(x=>x.id=='condition').length != 0) {
    next_condition = returnjson_form.where(x=>x.id=='condition').first().value;
  }
  return next_condition;
}

//通过fields的所有表单值，根据nodedetail的标准表单构造new _status
function Build_Returnjson_As_Newstatus(node_detail, fields) {
  var returnjson_form = node_detail.Return_json.form;
  // console.log(returnjson_form);
  //这是同步函数
  //*请注意，一般我们默认的情况是，returnjson_form这个配置里面肯定要包含case_node_id
  returnjson_form.forEach(function(element) {
    if (typeof fields[element.id] != undefined) {
      element.value = fields[element.id];
    }
    //returnjson_form构建完毕，添加一些必要项后压入content.status和history
  });
  return returnjson_form;
}
