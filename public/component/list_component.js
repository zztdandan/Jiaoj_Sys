

//字符串形式
var TextInput = Vue.extend({
    props: ["params"],
    template: '<input :name=" input_name" :id="input_id" type="text" v-model="input_value" />',
    data: function () {

        return {
            input_value: "",
            input_name: this.params.id,
            input_id: "id_" + this.params.id
        }
    }
});

//数字形式
var NumberInput = Vue.extend({
    props: ["params"],
    template: '<input :name=" input_name" :id="input_id" type="number" v-model="input_value"/>',
    data: function () {
        return {
            input_value: "",
            input_name: this.params.id,
            input_id: "id_" + this.params.id
        }
    }
});
//上传按钮
var SubmitInput = Vue.extend({
    props: ["params"],
    template:
        '<input type="submit" :value="button_value" class="button button-raised button-primary button-pill"/>',
    data: function () {
        return {
            button_value: this.params.value
        }
    }
});
//图片上传modal，有触发函数
var PictureModalInput = Vue.extend({
    props: ["params"],
    template: "<div>" +
        '<input type="button" :value="button_value" class="button button-action button-rounded" style="margin:8px;display:inline-block" @click="showmodal"/>' +
        '<input type="text" v-model="url_value" :name="input_name" :id="input_id" style="display:none"/>' +
        '<p style="margin:8px;display:inline-block">{{suc_flag}}</p>' +
        ' </div>',
    data: function () {
        return {
            button_value: "提交图片",
            url_value: "",
            input_id: "id_" + this.params.id,
            input_name: this.params.id,
            suc_flag: ""
        }
    },
    methods: {
        showmodal: function () {

        }
    }

});


//里面会包含一个input,具体由:is 指定
var InputContainer = Vue.extend({
    props: ["params"],
    template: '<div class="item-inner"><div class="item-title label">{{list_label}}</div>' +
        '<div class="item-input">' +
        "<input :is=\"component\" :params=\"params\" />" +
        '</div>' +
        '</div>',
    components: {
        'text-input': TextInput,
        'number-input': NumberInput,
        'submit-input': SubmitInput,
        'picture-modal-input': PictureModalInput
    },
    data: function () {

        var component_id = this.params.type + "-input";
        return {
            list_label: this.params.label,
            component: component_id
        }
    }

});
//通用表单结构，将在.item-title.label里面填入表单内容，以及在
var CommonList = Vue.component('common-list', {
    props: ["params"],
    template: '<li>' +
        '<div class="item-content">' +

        "<input-container :params=\"cildparams\"></input-container>" +


        '</div>' +
        '</li>',
    components: {
        "input-container": InputContainer
    },
    data: function () {
        return {
            cildparams: this.params
        }

    }

});