var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
var case_node_mode = require('./case_node_model');
var case_index_model = function() {};

case_index_model.read_start_node = function(case_id, next) {
  var em = new easy_mysql('case_index');
  em.where('rec_id= ' + case_id).find(function(data) {
    var em1 = new easy_mysql('case_node');
    em1.where('rec_id=' + data.CASE_START_NODE).find(function(data) {
      next(data);
    });
  });
};
//获得包括case所有node信息的case回调
case_index_model.get_case_info_all_pro = function(case_id) {
  return new Promise(function(resolve, reject) {
    let em = new easy_mysql('case_index');
    try{
      em.where('rec_id= ' + case_id).find(function(case_index_data) {
        let case_data = case_index_data;
        var em1 = new easy_mysql('case_node');
        em1.where('case_id= ' + case_index_data.REC_ID).select(function(case_node_list) {
          case_data.node_list = case_node_list;
          resolve(case_data);
        });
      });
    }catch(e){
      reject(e);
    }
    
  });
};

module.exports = case_index_model;
