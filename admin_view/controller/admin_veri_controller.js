var express = require('express');
var router = express.Router();
var path = require('path');
var admin_menu_model = require(path.join(process.cwd(), 'admin_view', 'model', 'admin_menu_model'));
var case_node_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_model'));

var case_node_type_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_node_type_model'));
const case_progress_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_progress_model'));
const case_index_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_index_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
const formdata = require('formidable');
const user_info_model = require(path.join(process.cwd(), 'menu', 'model', 'user_info_model'));
var Enumerable = require('linqjs');
//审核目录页面进入
//读取参数为case,意思是case_id
router.get('/index', function(req, res, next) {
  //渲染页面
  console.log('/admin_view/veri/index');

  res.render(path.join('admin_view', 'view', 'veri', 'index.ejs'));
});
//获得这个审核节点所有progress的进度信息
router.get('/case_progress_list', function(req, res, next) {
  console.log('获得这个case的所有progress');
  var case_id = req.query.case_id;
  var start_time = req.query.start_time;
  var end_time = req.query.end_time;
  case_progress_model.find_progress_list_by_case_id(case_id, function(data) {
    try {
      var returndata = Enumerable.from(data)
        .where(function(x) {
          return x.LAST_TIME >= start_time && x.LAST_TIME <= end_time;
        })
        .select(function(x) {
          return x;
        });
      res.json(new csexception(true, 'success', returndata));
    } catch (e) {
      res.json(new csexception(false, 'case_progress_model.find_progress_list_by_case_id出现问题', {}));
    }
  });
});
router.get('/case_node_progress_list', function(req, res, next) {
  console.log('获得这个case_node的所有progress');
  var case_node_id = req.query.case_node_id;
  var start_time = req.query.start_time;
  var end_time = req.query.end_time;
  case_progress_model.find_progress_list_by_case_node_id(case_node_id, function(data) {
    try {
      var returndata = Enumerable.from(data)
        .where(function(x) {
          return x.LAST_TIME >= start_time && x.LAST_TIME <= end_time;
        })
        .select(function(x) {
          return x;
        });
      res.json(new csexception(true, 'success', returndata));
    } catch (e) {
      res.json(new csexception(false, 'case_progress_model.find_progress_list_by_case_id出现问题', {}));
    }
  });
});
//这个页面的渲染取决于取回来的progress的值，如果是个开始节点，则取决于case_node值。总之详细渲染是vue的事，后端只负责按照数据库结构跳转
router.get('/detail', function(req, res, next) {
  //渲染页面
  console.log('/admin_view/veri/detail');
  var case_node_id = req.query.node_id;
  case_node_model.read_node_by_id(case_node_id, function(node) {
    //读取node_type获取渲染页面地址
    case_node_type_model.get_type_by_name(case_node_id.node_type, function(node_type) {
      console.log(node_type);
      res.render(node_type.RENDER_URL);
    });
  });
});
//获得该node的详情信息
router.get('/node_detail', function(req, res, next) {
  var case_node_id = req.query.case_node_id;
  case_node_model.read_node_by_id(case_node_id, function(node) {
    var res_json = JSON.parse(node.node_detail);
    res.json(new csexception(true, 'success', res_json));
  });
});
//获得该case_progress的现状数据
router.get('/get_progress_status', function(req, res, next) {
  var case_progress_id = req.query.case_progress_id;
  case_progress_model.find_case_progress_by_id(case_progress_id, function(case_progress) {
    var res_json = JSON.parse(case_progress.content);
    res.json(new csexception(true, 'success', res_json.status));
  });
});
//审核下一步操作
router.post('/progress_post_veri', function(req, res, _next) {
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
//获得某progress的历史信息
router.get('/case_progress_history', function(req, res, next) {
  var case_progress_id = req.query.case_progress_id;
  case_progress_model.find_case_progress_by_id(case_progress_id, function(case_progress) {
    var res_json = JSON.parse(case_progress.content);
    res.json(new csexception(true, 'success', res_json.history));
  });
});

//获得管理员目前待办的事项合集
router.get('/progress_todo_count', function(req, res, next) {
  async function doasync() {
    // 由于现在不区分权限，所以管理员拥有全部权限
    //先查出目前节点中有哪些可以审核(case_node中do_role带admin的)，然后使用mysql一次查出所有可以审核的progress
    let case_node_dorole_list = await case_node_model.read_nodelist_by_role_pro('admin');
    let progress_todo_list = await case_progress_model.find_progress_by_node_list_pro(
      case_node_dorole_list.select(x => x.rec_id)
    );

    return progress_todo_list;
  }
  try {
    let a = doasync().then(re => {
      res.json(new csexception(true, 'success', re));
    });
  } catch (e) {
    res.json(new csexception(false, '出现错误', e));
  }
});

//获得管理员目前待办的事项，所有progress,所有相关node，所有相关case
router.get('/progress_todo_amount', function(req, res, next) {
  async function doasync() {
    // 由于现在不区分权限，所以管理员拥有全部权限
    //先查出目前节点中有哪些可以审核(case_node中do_role带admin的)，然后使用mysql一次查出所有可以审核的progress
    let case_node_dorole_list = await case_node_model.read_nodelist_by_role_pro('admin');
    //获得需要审批的所有节点的list
    let progress_todo_list = await case_progress_model.find_progress_by_node_list_pro(
      case_node_dorole_list.select(x => x.rec_id)
    );
    //获得相关的所有case的list
    let case_index_list = await case_index_model.read_case_by_caselist_pro(progress_todo_list.select(x => x.CASE_ID));
    let ally_user_list = await user_info_model.get_user_by_id_list(progress_todo_list.select(x => x.PROGRESS_CREATOR));
    let ally_nodeid_list = progress_todo_list.select(x => x.NODE_ID);
    let ally_node_list = case_node_dorole_list.where(x => {
      return ally_nodeid_list.contains(x.rec_id);
    });
    return {
      progress: progress_todo_list,
      case: case_index_list,
      node: ally_node_list,
      user: ally_user_list
    };
  }
  try {
    let a = doasync().then(re => {
      res.json(new csexception(true, 'success', re));
    });
  } catch (e) {
    res.json(new csexception(false, '出现错误', e));
  }
});
//获得特殊的带所有节点和NODE信息，用户信息的progress审核的return
router.get('/progress_veri_amount', function(req, res, next) {
  async function doasync() {
    async function get_nodelist_from_history(history_list) {
      let a = new Array();
      history_list.forEach(ele => {
        a.push(ele.where(x => x.id == 'case_node_id').first().value);
      });
      return a;
    }
    //获得传入的progress_id
    let progress_id = req.query.progress_id;
    //获得需要审批的所有节点的list
    let progress_info = await case_progress_model.find_case_progress_by_id_pro(progress_id);
    let node_id_list = await get_nodelist_from_history(JSON.parse(progress_info.CONTENT).history);
    node_id_list.push(progress_info.NODE_ID.toString());
    //获得相关的node
    let node_list=await case_node_model.read_node_by_nodelist_pro(node_id_list);
    let case_info=await case_index_model.get_case_info_pro(progress_info.CASE_ID); 
 let user_info=await user_info_model.read_user_info_pro(progress_info.PROGRESS_CREATOR);
    return {
      progress: progress_info,
      case: case_info,
      node: node_list,
      user: user_info
    };
  }
  try {
    let a = doasync().then(re => {
      res.json(new csexception(true, 'success', re));
    });
  } catch (e) {
    res.json(new csexception(false, '出现错误', e));
  }
});
module.exports = router;

//通过判断returnjson里有无condition键值，赋给condition不同的值
function GetconditionByReturnjson(returnjson_form) {
  let next_condition = null;
  if (typeof returnjson_form.condition != 'undefined') {
    next_condition = returnjson_form.condition;
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
