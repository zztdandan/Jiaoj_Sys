<template>
    <!-- 首页 -->
    <div class="page" id='menu_app'>
        <!-- 页头页脚 -->
        <div id="vuecontent">
            <simple-header ti="柳州交警"></simple-header>
            <simple-footer></simple-footer>
            <div class="content">
                <image-block :imgurl='imgurl'></image-block>
                <div class="content-block">
                    <!-- 警示区域 -->
                    <!-- <warning-block :warninglist='warninglist'></warning-block> -->
                    <!-- 业务按钮模块 -->
                    <case-menu-block :menuindex='caseindex'></case-menu-block>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var path = require("path");
    import jquery from "jquery";
    import MobileFooter from "components/Common_comp/MobileFooter";
    import MobileHeader from "components/Common_comp/MobileHeader";
    import ImageBLock from "components/menu_app_comp/ImageBLock";
    import CaseMenuBlock from "components/menu_app_comp/CaseMenuBlock";

    export default {
      name: "menu_app",
      components: {
        "simple-header": MobileHeader,
        "simple-footer": MobileFooter,
        "image-block": ImageBLock,
        "case-menu-block": CaseMenuBlock
      },
      data: function () {
            return {
                warninglist: [],
                imgurl: ['/img/pic1.png', '/img/pic2.jpg', '/img/pic3.jpg'],
                caseindex: []
            }
        }
    };
      //显示警告
    function ShowWarning() {
        $.ajax({
            type: "get",
            url: '/user_warning_info',


            success: function (data) {
                if (data != null) {
                    data.forEach(function (a) {
                        k.warninglist.push(a);
                    });
                }
            },
            error: function (data) {
                alert("操作出现错误" + data);
            }
        });
    }
    function ReadUserMenu() {
        $.ajax({
            type: "get",
            url: '/user_menu',
            success: function (data) {
                if (data != null) {
                    data.forEach(function (index_alone) {
                        k.caseindex.push(index_alone);
                    });
                }
            },
            error: function (data) {
                alert("操作出现错误" + data);
            }
        });
    }
    jQuery(function () {

        ShowWarning();
        ReadUserMenu();
    });
    function relocation(url) {
        this.location = url;
    }
</script>





<style>
.menu-icon {
  display: inline-block;
  text-align: center;
  color: blue;
}

.case-item-title {
  display: block;
}

.new-btn {
  margin-bottom: 1em;
}

/* .col-xs-4{
            padding-left: 5px;
            padding-right: 5px;
        } */
</style>
