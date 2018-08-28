// var case_progress_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_progress_model'))

var express = require('express');
var router = express.Router();
var path = require('path');
var randomword = require(path.join(process.cwd(), 'logic', 'randomword'));
var easy_mysql = require(path.join(process.cwd(), 'mydb', 'easy_mysql'));
const moment = require('moment');
const case_index_model = require(path.join(process.cwd(), 'user_view', 'case', 'model', 'case_index_model'));
var case_progress_model = function() {
  this.PROGRESS_NAME = '';
  this.PROGRESS_CREATOR = '';
  this.CASE_ID = 0;
  this.NODE_ID = 0;
  this.REC_ID = '';
  //定义全局的progress里面的content的数据格式
  this.content = JSON.stringify({
    status: {},
    history: []
  });
};
//业务实体按id查询
case_progress_model.find_case_progress_by_id = function(REC_ID, next) {
  var em = new easy_mysql('case_progress');
  em.where('REC_ID="' + REC_ID + '"').find(function(data) {
    if (data == null) {
      throw new Error('查找progress报错');
    }
    next(data);
  });
};
//新建一条业务数据实体
case_progress_model.init_new_case = function(node_id, user_info, next) {
  try {
    case_index_model.get_case_info_pro(node_id.case_id).then(case_info => {
      let new_progress = new case_progress_model();
      new_progress.CASE_ID = node_id.case_id;
      new_progress.NODE_ID = node_id.rec_id;
      new_progress.PROGRESS_CREATOR = user_info.REC_ID;
      new_progress.PROGRESS_NAME = user_info.FORIEGN_CNAME + ',' + case_info.CASE_NAME+','+moment().format('YYYY年MM月DD日');
      new_progress.REC_ID = randomword(false, 8);
      var em = new easy_mysql('case_progress');
      em.add(new_progress, function(id) {
        next(new_progress);
      });
    });
  } catch (e) {
    throw new Error('建立case_progress出错');
  }
};
//只允许更新case_progress这两项属性，其他属性在init的时候已经定死了
//请注意，传入此处的progress已经定性升级完毕，这一部只是修改一下case_node_id也就是移一下位置而已
case_progress_model.update_case_progress = function(progress_rec_id, progress_node, progress_content, next) {
  var em = new easy_mysql('case_progress');

  em.where('REC_ID="' + progress_rec_id + '"').find(function(progress_data) {
    progress_data.NODE_ID = progress_node;
    if (typeof progress_content == 'object') {
      progress_content = JSON.stringify(progress_content);
    }
    progress_data.CONTENT = progress_content;
    progress_data.LAST_TIME = moment().format('YYYYMMDDHHmmss');
    let res = progress_data;
    em.where('REC_ID="' + progress_rec_id + '"').save(progress_data, function(aaa) {
      next(res);
    });
  });
};

//在已有content的基础上制作一个更新的content
case_progress_model.update_progress_nosave_hasreturn = function(progress, node_id, user_id, new_status) {
  //1、将content字符串格式化
  var progress_content = JSON.parse(progress.content);
  //2、将即将变成现在status的json添加时间和user_id属性
  new_status.user_id = user_id;
  new_status.time = moment().format('YYYYMMDDHHmmss');
  //3、将新的status压入现状status部分
  //! 请注意，由于旧的现状在上一次的同等操作中已经压入了历史，所以此时已存在的status不需要再次压入历史
  progress_content.status = new_status;
  //4、将新的status压入历史
  //! 请注意，每一个现状都要压入历史，因为查询历史数据的时候必须是包含现状的
  progress_content.history.push(progress_content.status);
  //5、将content转化成字串并写入progress
  progress.CONTENT = JSON.stringify(progress_content);
  //6、修改progress的node信息
  progress.NODE_ID = node_id;
  //7、返回progress
  return progress;
};

//通过new_status和user_id制作一个新的只有第一条历史记录的content
case_progress_model.create_new_progress_content = function(new_status, user_id) {
  //定义全局的progress里面的content的数据格式(已经在本函数里定义过)
  var content = JSON.parse(new case_progress_model().content);
  //在returnjson里面添加两项历史变量
  new_status.user_id = user_id;
  new_status.time = moment().format('YYYYMMDDHHmmss');
  //! returnjson压入现状，同时压入历史
  //! 请注意，每一个现状都要压入历史，因为查询历史数据的时候必须是包含现状的
  content.status = new_status;
  // content.history.push(new_status);
  content.history.push(content.status);
  return content;
};

case_progress_model.find_progress_list_by_case_id = function(case_id, next) {
  var em = new easy_mysql('case_progress');
  em.where('CASE_ID="' + case_id + '"').find(function(data) {
    if (data == null) {
      throw new Error('查找progress报错');
    }
    next(data);
  });
};

case_progress_model.find_progress_list_by_case_node_id = function(case_node_id, next) {
  var em = new easy_mysql('case_progress');
  em.where('NODE_ID="' + case_node_id + '"').find(function(data) {
    if (data == null) {
      throw new Error('查找progress报错');
    }
    next(data);
  });
};

case_progress_model.find_progress_list_by_user_pro = function(user_id) {
  return new Promise((resolve, reject) => {
    var em = new easy_mysql('case_progress');
    em.where('PROGRESS_CREATOR= "' + user_id + '"').select(function(list) {
      if (list == null) {
        reject('查找progress报错');
      }
      resolve(list);
    });
  });
};

module.exports = case_progress_model;
