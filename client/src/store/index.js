import Vue from 'vue'
import Vuex from 'vuex'
import { account } from "@/store/account"
import { notification } from "@/store/notification"
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
    notification,
    application,
    product
  }
})
