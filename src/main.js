import Promise from 'promise-polyfill'
window.Promise = window.Promise || Promise
import './common/util'
import './common/oss-client' // 阿里云文件服务

// import './assets/style/ivu-cover.less'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
sync(store, router)

import './api'
import './filters'
import './directives'

const app = new Vue({
  router,
  store,
  ...App
})
window.__VUE_ROOT = Vue

app.$mount('#app')
