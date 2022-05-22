import Vue from 'vue'
import Vuex from 'vuex'
import { application } from "@/store/application"
import { notification } from "@/store/notification"
import { account } from "@/store/account"
import { userData } from "@/store/user-data"
import { mealPlan } from "@/store/meal-plan"
import { food } from "@/store/food"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    application,
    notification,
    account,
    userData,
    mealPlan,
    food,
  }
})
