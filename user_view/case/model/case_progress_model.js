var express = require('express');
var router = express.Router();
var path = require('path');



case_progress_model = function () {
    this.PROGRESS_NAME = "";
    this.PROGRESS_CREATOR = "";
    this.CASE_ID = 0;
    this.NODE_ID = 0;
}

case_progress_model.init_new_case = function (node,userid) {
    var detail = JSON.parse(node.detail);
    var new_progress = new case_progress_model();
    new_progress.CASE_ID = node.CASE_ID;
    new_progress.NODE_ID = node.REC_ID;
    new_progress.PROGRESS_CREATOR=userid;
    new_progress.PROGRESS_NAME=userid+","+new_progress.CASE_ID;
    

}







module.exports = case_progress_model;