<template>

  <div class="page-group">
    <!-- 首页 -->
    <div class="page page-current" id="homerouter">
      <div id="headerfooter">
        <simple-header ti="表单提交"></simple-header>
        <simple-footer></simple-footer>
      </div>
      <user-submit-form-comp v-bind:items="items"></user-submit-form-comp>
    </div>
</template>

<script>
  import $ from "jquery";
  import jqueryform from "jquery-form";
  var path = require("path");
  const UserSubmitFormComp = require(path.join(__dirname,));
  import MobileFooter from "../Common_comp/MobileFooter";
  import MobileHeader from "../Common_comp/MobileHeader";
  export default {
    name: "case_USER_FORM_SUBMIT",
    components: {
      "user-submit-form-comp": UserSubmitFormComp,
      "simple-header": MobileHeader,
      "simple-footer": MobileFooter
    },
    data() {
      return {
        items: []
      };
    },

    created: function() {
      var k = this;
      var Request = new Object();
      Request = GetRequest();
      //通过类获取该url的node_id
      var case_node_id = Request["id"];
      var case_progres_id = Request["progress"];
      //初始化，读取case_node信息
      axios({
        method: "get",
        url: "/user_view/case/getUserSubForm",
        data: { case_node_id: case_node_id }
      })
        .then(function(data) {
          case_info = data;
          data.UserSubForm.forEach(function(form_item) {
            k.items.push(form_item);
          });
          //新增申请特殊处理,仅适用于没创建caseprogress情况
          if (data.node_cate == "start") {
            //添加一个提交按钮
            k.items.push({ type: "submit", label: "提交", value: "提交申请" });
            //显示一个noti框用于第一次提交的人显示须知
            var newmodal = $.modal({
              title: data.notification_title,
              afterText: data.notification,
              buttons: [
                {
                  text: "取消申请",
                  onClick: function() {
                    history.back();
                  }
                },
                {
                  text: "阅读完毕",
                  bold: true,
                  onClick: function() {}
                }
              ]
            });
          } else {
            //添加一个提交按钮
            k.items.push({ type: "submit", label: "提交", value: "提交填写" });
            //添加一个隐藏输入，存储新增表单的case_progress_id
            k.items.push({
              type: "visi",
              id: "case_progress_id",
              value: case_progres_id
            });
          }
          //添加一个隐藏输入，存储新增表单的case_id
          k.items.push({ type: "visi", id: "case_id", value: data.case_id });
          //添加一个隐藏输入，存储新表单的case_node_id
          k.items.push({ type: "visi", id: "case_node_id", value: case_node_id });
        })
        .catch(function(err) {
          alert("操作出现错误" + err);
          console.log(err);
        });

      //表单提交的回调绑定
      $("#USER_FORM_SUBMIT").ajaxForm(function(data) {
        if (typeof data.code == "undefined") {
          $.alert("出现严重错误");
        }
        if (data.Flag) {
          $.toast("上传成功");
        } else {
          $.toast("上传失败");
        }
      });
    }
  };
</script>

<style scoped>
</style>