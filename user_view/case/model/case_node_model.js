var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
var case_node_model = function() {};
case_node_model.read_node_by_id = function(id, next) {
  var em = new easy_mysql('case_node');
  em.where('rec_id=\'' + id + '\'').find(function(data) {
    next(data);
  });
};
//回传这个progress的下一个node的case_node信息
case_node_model.read_next_node_by_this_progress = function(case_progress_json, next) {
  let condition = null;
  let tmp = JSON.parse(case_progress_json.content);
  if (typeof tmp.status.condition != 'undefined') {
    condition = tmp.status.condition;
  }
  var this_node_id = case_progress_json.NODE_ID;
  case_node_model.read_next_node_by_this_node_id(this_node_id, condition, next);
};

case_node_model.read_next_node_by_this_node_id = function(this_node_id, condition, next) {
  var em = new easy_mysql('case_node');
  em.where('rec_id= ' + this_node_id).find(function(data) {
    if (data.node_next.indexOf(',') >= 0) {
      //下一个节点不是单节点
      let qry_str = 'start_node= ' + this_node_id;
      var em1 = new easy_mysql('case_map');
      if (condition != null) {
        qry_str = 'start_node= ' + this_node_id + ' and `condition`= "' + condition+'"';
      }
      em1.where(qry_str).find(function(data) {
        var node_id = data.end_node;
        case_node_model.read_node_by_id(node_id, function(node) {
          next(node);
        });
      });
    } else {
      var node_id = data.node_next;
      case_node_model.read_node_by_id(node_id, function(node) {
        next(node);
      });
    }
  });
};
//promise函数序列

//获得所有该role应做的列表
case_node_model.read_nodelist_by_role_pro = function(role_str) {
  //!这里应该加个入口函数的验证，时间紧先不写
  return new Promise(function(resolve, reject) {
    let em = new easy_mysql('case_node');
    em.where('do_role= "' + role_str + '"').select(datalist => {
      resolve(datalist);
    });
  });
};

case_node_model.read_node_by_nodelist_pro=function(node_list){
  return new Promise(function(resolve,reject){
    let em = new easy_mysql('case_node');
    let array_str=node_list.join(',');
    let where_sql='FIND_IN_SET(rec_id,"'+array_str+'")';
    em.where(where_sql).select(datalist => {
      resolve(datalist);
    });
  });
};
module.exports = case_node_model;
