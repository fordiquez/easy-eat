import Vue from 'vue'
import Vuex from 'vuex'
import { account } from "@/store/account"
import { alert } from "@/store/alert"
import { application } from "@/store/application"
import { product } from "@/store/product"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,
    alert,
    application,
    product
  }
})
