// //modal共用模板
// var ModalCommon = Vue.component({
//     props: { prop_modal_id: String },
//     template:
//         '<div class="modal fade" :id="modal_id" tabindex="-1" role="dialog" aria-hidden="true">' +
//         '<div class="modal-dialog" role="document">' +
//         '<div class="modal-content">' +
//         '<div class="modal-header">' +
//         '<h5 class="modal-title"><slot name="title"></slot></h5>' +
//         //?这是一个关闭按钮，寻找更好的方式来表现他
//         '<button class="close" type="button" data-dismiss="modal" aria-label="Close">' +
//         '<span aria-hidden="true">×</span>' +
//         '</button>' +
//         '</div>' +
//         '<div class="modal-body"><slot name="body"></slot></div>' +
//         '<div class="modal-footer">' +
//         '<slot name="footer"></slot>' +
//         '</div>' +
//         '</div>' +
//         '</div>' +
//         '</div>' +
//         '</div>',
//     data: function () {
//         return {
//             modal_id: this.prop_modal_id
//         }
//     }
// });