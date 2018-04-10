import Vue from 'vue'
import Vuex from 'vuex'

import module_public from './m_public'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    m_public: module_public
  }
})

export default store
