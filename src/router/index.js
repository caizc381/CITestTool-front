import Vue from 'vue'
import Router from 'vue-router'

import module_public from './m_public'
import module_order from './m_order'
import module_resource from './m_resource'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: '/channel',
  routes: [
    ...module_public, ...module_order, ...module_resource
  ]
})
