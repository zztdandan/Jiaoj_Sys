
var AdminTitle = Vue.extend({
    props: {},
    template: '<div>' +
        '<a class="navbar-brand mr-1" href="/admin_view"><slot></slot></a>' +
        '<button class="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle" href="#"><i class="icon iconfont icon-paiming"></i></button>' +
        ' </div>',
    data: function () {
        return {

        };
    }
});


var NavbarSearch = Vue.extend({
    props: {},
    template:
        '<form class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">' +
        '<div class="input-group">' +
        '<input type="text" name="search_text" v-model="searchtext" class="form-control" placeholder="搜索业务项" />' +
        '<div class="input-group-append">' +
        '<button class="btn btn-primary" type="button" v-on:click="search">' +
        '<i class="icon iconfont icon-query_zhongqian"></i>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '</form>',
    data: function () {
        return {
            searchtext: ""
        }
    },
    methods: {
        search: function (event) {
            console.log("search");
        }
    }
});
var NavbarMessage = Vue.extend({
    props: {},
    template:
        '<li class="nav-item dropdown no-arrow mx-1">' +
        '<a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fas fa-bell fa-fw"></i>' +
        '<span class="badge badge-danger">9+</span>' +
        '</a>' +
        '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown">' +
        '<a class="dropdown-item" href="#">Action</a>' +
        '<a class="dropdown-item" href="#">Another action</a>' +
        '<div class="dropdown-divider"></div>' +
        '<a class="dropdown-item" href="#">Something else here</a>' +
        '</div>' +
        '</li>',
    data: function () {
        return {
            messagenum: 0
        }
    }
});

//modal共用模板
var ModalCommon = Vue.component('modal-common',{
    props: { prop_modal_id: String },
    template:
        '<div class="modal fade" :id="modal_id" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title"><slot name="title"></slot></h5>' +
        //?这是一个关闭按钮，寻找更好的方式来表现他
        '<button class="close" type="button" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body"><slot name="body"></slot></div>' +
        '<div class="modal-footer">' +
        '<slot name="footer"></slot>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    data: function () {
        return {
            modal_id: this.prop_modal_id
        }
    }
});

var LogoutModal = Vue.extend({
    props: {},
    template:
        '<div>' +
        '<modal-common prop_modal_id="logoutModal">' +
        
        '<template slot="title">' +
        '登出title' +
        '</template>' +
        '<template slot="body">' +
        '登出modal内容' +
        '</template>' +
        '<template slot="footer">' +
        '<button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>' +
        '<a class="btn btn-primary" href="login.html">Logout</a>' +
        '</template>' +
        '</modal-common>' +
        '</div>',
    data: function () {
        return {

        }
    },
    components: {
        "modalcommon": ModalCommon
    }


});





var Navbaruser = Vue.extend({
    props: {},
    template:
        '<li class="nav-item dropdown no-arrow">' +
        '<a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fas fa-bell fa-fw"></i>' +
        '</a>' +
        '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">' +
        '<a class="dropdown-item" href="#">Settings</a>' +
        '<a class="dropdown-item" href="#">Activity Log</a>' +
        '<div class="dropdown-divider"></div>' +
        '<a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Logout</a>' +
        
        '</div>' +
        '</li>',
    data: function () {
        return {
            messagenum: 0
        }
    },
    components: {
       
    }
});

var NavbarComp = Vue.component('navbar-comp', {
    props: {},
    template:
        '<nav class="navbar navbar-expand navbar-dark bg-dark static-top">' +
        '<admin-title>交警系统管理后台</admin-title>' +
        '<navbar-search></navbar-search>' +
        '<ul class="navbar-nav ml-auto ml-md-0">' +
        '<li is="navbar-message"></li>' +
        '<li is="navbar-user"></li>' +
        '</ul>' +
        '</nav>'
        
    ,
    data: function () {
        return {


        }
    },
    components: {
        "admin-title": AdminTitle,
        "navbar-search": NavbarSearch,
        "navbar-message": NavbarMessage,
        "navbar-user": Navbaruser
    }
});







