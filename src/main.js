import Promise from 'promise-polyfill'
window.Promise = window.Promise || Promise

import './assets/iconfont/iconfont.less'
import './assets/style/common.less'
import './common/util.js'

import ElementUI from 'element-ui' // 完整引入ElementUI
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import iView from 'iview'
import './assets/style/ivu-theme.less'
Vue.use(iView)

import mtView from 'mtview'
import 'mtview/dist/styles/mtview.css';
Vue.use(mtView)

import Vue from 'vue'
import $ from 'jquery'
import { sync } from 'vuex-router-sync'
import App from './components/app'
import router from './router'
import store from './store'
sync(store, router)

router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    next();
    return;
  }
  Vue.http.get('accountInfo').then((response) => {
    store.commit('SET_ACCOUNT_INFO', response.body.account);
    store.commit('SET_CHANNEL', (response.body.channel || {}));
    next();
  }, (res) => {
    alert('获取用户信息失败');
    window.location.href = window.location.origin;
  });
})

import './api'
import './filters'

const app = new Vue({
  router,
  store,
  ...App
})

app.$mount('#app')
