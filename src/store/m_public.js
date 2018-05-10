import Vue from 'vue'

const module_public = {
  state: {
    selectMenuName: '',
    accountInfo: undefined,
    channel: {}
  },

  mutations: {

    CHOOSE_MODULE (state, mName) {
      state.selectMenuName = mName;
    },

    SET_ACCOUNT_INFO (state, accountInfo) {
      state.accountInfo = accountInfo;
    },

    SET_CHANNEL(state,channel){
      state.channel = channel;
    },

    REMOVE_ACCOUNT_INFO (state) {
      state.accountInfo = undefined;
    }

  },

  actions: {

    logout({ commit }, router) {
      Vue.http.get('logout').then((response) => {
        commit('REMOVE_ACCOUNT_INFO');
        router.push({path: '/login'});
      }, (res) => {
      });
    }
  },

  getters: {
  }
}

export default module_public;
