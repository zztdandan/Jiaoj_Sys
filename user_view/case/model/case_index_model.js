var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
var case_node_mode = require('./case_node_model');
var case_index_model = function () { }

case_index_model.read_start_node = function (case_id, next) {
    var em = new easy_mysql("case_index");
    em.where('rec_id=' + case_id).find(function (data) {
      var em1=new easy_mysql("case_node");
      em1.where('rec_id='+data.CASE_START_NODE).find(function(data){
        next(data);

      });
    });


}



module.exports = case_index_model;