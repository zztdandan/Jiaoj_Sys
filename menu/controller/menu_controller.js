var express = require('express');
var router = express.Router();
var path = require('path');
var user_menu_model = require(path.join(process.cwd(), 'menu', 'model', 'user_menu_model'));
const csexception = require(path.join(process.cwd(), 'logic', 'csexception'));
var linqjs = require('linqjs');
//获得menulist
router.get('/', function(req, res, next) {
  user_menu_model.read_user_menu().then(function(menuList) {
    console.log('menu_controller');

    res.json(new csexception(true, 'suc', menuList));
  });
});
//获得业务大类的ntext，在code_desc，由于有多项，所以是直接输出list的。在前台是直接读取dic+list[i].CODE_DESC
router.get('/allmenu', function(req, res, next) {
  async function doall() {
    let menu_dic = await user_menu_model.read_user_menu_dic();
    let menu_list = await user_menu_model.read_user_menu();
    let returnObj = [];
    var one_menu_list = function(one_cate) {
      var show = new Array();
      let more=new Array();
      menu_list.forEach(x => {
        if (x.MENU_CATE == one_cate.name) {
            if(show.length<one_cate.top_num){
                show.push(x);
            }
            else{
                more.push(x);
            }
         
        }
      });

      return {show:show,more:more};
    };
    menu_dic.forEach(one_cate => {
      let detail = JSON.parse(one_cate.CODE_DESC);
      
        var twolist= one_menu_list(detail);
        detail.show_menu=twolist.show;
        detail.more_menu=twolist.more;
        returnObj.push(detail);
    
    });
    res.json(new csexception(true, 'suc', returnObj));
  }
  doall();
});

//获得业务大类的ntext，在code_desc，由于有多项，所以是直接输出list的。在前台是直接读取dic+list[i].CODE_DESC
router.get('/dic', function(req, res, next) {
  user_menu_model.read_user_menu_dic().then(function(dic_list) {
    // console.log('menu_controller');

    res.json(new csexception(true, 'suc', dic_list));
  });
});

module.exports = router;
