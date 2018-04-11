import Vue from 'vue'
import store from '../store'

Vue.directive('clickoutside', {
  bind (el, binding, vnode) {
      function documentHandler (e) {
          if (el.contains(e.target)) {
              return false;
          }
          if (binding.expression) {
              binding.value(e);
          }
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
  },
  unbind (el, binding) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
  }
});

//权限
Vue.directive('permission', function(el, binding){
   var list = localStorage.permissions || '';
   if (list.indexOf(binding.value) > -1){
     el.hidden = false
   }else{
     el.hidden = true
   }
});
