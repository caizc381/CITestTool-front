import Vue from 'vue'
import vueResource from 'vue-resource'

import Router from 'vue-router'
Vue.use(Router)

Vue.use(vueResource);

let useCustomizedPath = true // 本地调试自定义后端地址，需要设成true

if(!useCustomizedPath || location.host.indexOf('mytijia.com')>-1){
  Vue.http.options.root = '/channel/action'
}else{
  Vue.http.options.root = 'http://192.168.3.241/channel/action'
}

Vue.http.options.emulateJSON = true;
Vue.http.options.credentials = true;

var UNIQUE_SUBMIT_TOKEN = "unique-submit-token";
var token = undefined;

Vue.http.interceptors.push((request, next) => {
	if(localStorage.getItem('_token')){
	 	request.headers.set(UNIQUE_SUBMIT_TOKEN, localStorage.getItem('_token'));
	}

	next((response) => {
		if(response.headers.get(UNIQUE_SUBMIT_TOKEN)){
			token = response.headers.get(UNIQUE_SUBMIT_TOKEN);
			localStorage.setItem('_token', token);
		}
		if (!response.ok) {
			if (response.body && response.body.text == '未登录') {
				window.location.href = window.location.origin + window.location.pathname;
			}
			if (response.body) {return response.body}
			response.text = "系统出错啦"
		}
		return response
	});

});
