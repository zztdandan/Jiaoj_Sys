import Vue from 'vue';
import case_USER_FORM_SUBMIT from './case_USER_FORM_SUBMIT';

import $ from 'jquery';

var parser=require('body-parser');
// var light7=require('../../../node_modules/light7/dist/js/light7');
import 'light7/dist/css/light7.min.css';
import axios from 'axios';
Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#main',
  template: '<case_USER_FORM_SUBMIT/>',
  components: { case_USER_FORM_SUBMIT }
});
