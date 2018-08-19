// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import menu_app from './menu_app.vue';
import light7 from 'light7';
import 'light7/dist/css/light7';
// Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<menu_app/>',
  components: { menu_app }
});
