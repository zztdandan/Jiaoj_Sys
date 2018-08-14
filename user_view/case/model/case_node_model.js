var easy_mysql = require(process.cwd() + '/mydb/easy_mysql');
var path = require('path');
var crypto = require(path.join(process.cwd(), 'menu', 'logic', 'crypto'));
var case_node_model = function () { };
case_node_model.read_node_by_id = function (id, next) {
    var em = new easy_mysql('case_node');
    em.where('rec_id=\'' + id+'\'').find(function (data) {
        next(data);
    });
};
//回传这个progress的下一个node的case_node信息
case_node_model.read_next_node_by_this_progress = function (case_progress_json, next) {
    
    var condition = case_progress_json.content.status.condition;
    var this_node_id = case_progress_json.node_id;
    case_node_model.read_next_node_by_this_node_id(this_node_id, condition, next);

};

case_node_model.read_next_node_by_this_node_id=function(this_node_id, condition, next) {
    var em = new easy_mysql('case_node');
    em.where('rec_id=' + this_node_id).find(function (data) {
        if (data.node_next.indexOf(',') >= 0) { //下一个节点不是单节点
            
            var em1 = new easy_mysql('case_map');        
            em1.where('start_node= ' + this_node_id + ' and condition= ' + condition).find(function (data) {
                var node_id = data.end_node;
                case_node_model.read_node_by_id(node_id, function (node) {
                    next(node);
                });
            });
        }
        else {
            var node_id = data.node_next;
            case_node_model.read_node_by_id(node_id, function (node) {
                next(node);
            });
        }
    });
};


module.exports = case_node_model;


