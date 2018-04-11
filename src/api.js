import Vue from 'vue'
import vueResource from 'vue-resource'
import ElementUI from 'element-ui' // 完整引入ElementUI
import Router from 'vue-router'
import iView from 'iview'
import mtView from 'mtview'

import 'element-ui/lib/theme-default/index.css' // 使用css
import './assets/style/ivu-theme.less'
import './assets/style/mtview-theme.less'
import './assets/style/common.less'
import './assets/style/tool.less'

Vue.use(vueResource)
Vue.use(ElementUI)
Vue.use(Router)
Vue.use(iView)
Vue.use(mtView)


let useCustomizedPath = true;
let apiBasePath = 'http://localhost:8007/ops';  //后端地址

Vue.http.options.root = (!useCustomizedPath || window.location.host.indexOf('mytijian.com') > -1 ? '/ops' : apiBasePath) + '/action'
// Vue.http.options.root = 'http://www.mytijian.com/ops/action';  //后端地址

Vue.http.options.emulateJSON = true;
Vue.http.options.credentials = true;  //跨域带cookie
var UNIQUE_SUBMIT_TOKEN = "unique-submit-token";
var token = undefined;
Vue.http.interceptors.push((request, next) => {
	request.url = Vue.http.options.root + request.url;

	if(localStorage.getItem('_token')){
	 	request.headers.set(UNIQUE_SUBMIT_TOKEN, localStorage.getItem('_token'));
	}

	next((response) => {
		if (request.mock) {
			response.ok = true;
			response.status = 200;
			let url = request.url.replace(Vue.http.options.root, '');
			response.body = require('./mock/' + url.replace(/[\/]/g, '_') + '.json');
		}

		if(response.headers.get(UNIQUE_SUBMIT_TOKEN)){
			token = response.headers.get(UNIQUE_SUBMIT_TOKEN);
			localStorage.setItem('_token', token);
		}
		if (!response.ok) {
			if (response.body && response.body.text == '用户还未登录') {
				window.location.href = window.location.origin + '/ops/';
			}
			if (response.body) {return response.body}
			response.text = "系统出错啦"
		}
		return response
	})

});
