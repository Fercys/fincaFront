import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login : false
  },
  mutations: {
    log_set(state, state_login){
      this.state.login = state_login
    }
    
  },
  actions: {

  }
})
