import { mealPlanService } from '@/services'
import {excludedFilter} from "@/utils/filters";

const state = () => ({
  selectedPlan: {
    title: null,
    proportions: {}
  },
  plans: [],
});

const getters = {
  getSelectedPlan: state => state.selectedPlan,
  getPlans: state => state.plans
}

const actions = {
  async getAll({ commit }) {
    return await mealPlanService.getAll().then(response => commit('SET_PLANS', response.data))
  },
  async create({ commit }, payload) {
    return await mealPlanService.create(payload).then(response => {
      console.log(response)
      commit('ADD_MEAL_PLAN', response.data)
      return response
    })
  },
  async update({ commit }, payload) {
    return await mealPlanService.update(payload).then(response => {
      console.log(response)
      commit('UPDATE_MEAL_PLAN', response.data)
      return response
    })
  },
  async delete({ commit }, id) {
    return await mealPlanService.delete(id).then(response => {
      console.log(response)
      commit('DELETE_MEAL_PLAN', id)
      return response
    })
  },
  setSelectedPlan: ({ commit }, selectedDiet) => commit('SET_SELECTED_PLAN', selectedDiet),
  clearSelectedPlan: ({ commit }) => commit('CLEAR_SELECTED_PLAN')
};

const mutations = {
  SET_PLANS: (state, plans) => state.plans = plans,
  ADD_MEAL_PLAN: (state, { mealPlan }) => state.plans.push(mealPlan),
  UPDATE_MEAL_PLAN: (state, { mealPlan }) => {
    const plan = excludedFilter(mealPlan, ['message'])
    const userIndex = state.plans.findIndex(item => item.id === mealPlan.id)
    Object.assign(state.plans[userIndex], plan)
  },
  DELETE_MEAL_PLAN: (state, id) => {
    const userIndex = state.plans.findIndex(item => item.id === id)
    state.plans.splice(userIndex, 1)
  },
  SET_SELECTED_PLAN: (state, selectedPlan) => Object.assign(state.selectedPlan, selectedPlan),
  CLEAR_SELECTED_PLAN: state => Object.assign({ title: null, proportions: {} }, state.selectedPlan),
};

export const mealPlan = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
