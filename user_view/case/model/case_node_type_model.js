var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');

var case_node_type_model = function () { };
case_node_type_model.get_type_by_name = function (node_type_name, next) {
    var em = new easy_mysql('case_node_type');
    em.where('CASE_NODE_TYPE=\''+node_type_name+'\'').find(function())

};

module.exports = case_node_type_model;
