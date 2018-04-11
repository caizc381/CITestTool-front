import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
  userinfo: {},
  isOpenMenu: true,
  leftMenus: []
}

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  UPDATE_USERINFO(state, user_db) {
    state.userinfo = user_db.userinfo || {};
  },
  REMOVE_USERINFO(state) {
     state.userinfo = {};
  },
  UPDATE_MENU_WIDTH(state) {
    state.isOpenMenu = !state.isOpenMenu;
  },
  UPDATE_LEFT_MENU(state, leftMenus) {
    state.leftMenus = leftMenus;
  }
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  },

  update_userinfo({ commit }, { userinfo }) {
     return new Promise((resolve, reject) => {
       commit('UPDATE_USERINFO', { userinfo });
       resolve();
     });
  },

  remove_userinfo({ commit }) {
    return new Promise((resolve, reject) => {
      commit('REMOVE_USERINFO');
      resolve();
    });
  },

  toggle_menu({ commit }) {
    return commit('UPDATE_MENU_WIDTH');
  },

  change_left_menu({ commit }, leftMenus) {
    return commit('UPDATE_LEFT_MENU', leftMenus);
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
