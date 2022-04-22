import Vue from 'vue'
import Vuex from 'vuex'
import myWallet from "@/store/modules/myWallet"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    walletStore: myWallet
  }
})
