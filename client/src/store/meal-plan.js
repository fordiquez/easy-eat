import { mealPlanService } from '@/services'
import { excludedFilter } from "@/utils/filters";

const state = () => ({
  mealPlan: {}
});

const getters = {
  getMealPlan: state => state.mealPlan
}

const actions = {
  async create({ commit }, payload) {
    return await mealPlanService.create(payload).then(response => {
      commit('SET_MEAL_PLAN', response.data)
      return response
    })
  },
  async getById({ commit }, id) {
    return await mealPlanService.getById(id).then(response => {
      commit('SET_MEAL_PLAN', response.data)
      return response
    })
  },
  // eslint-disable-next-line no-empty-pattern
  async edit({  }, payload) {
    return await mealPlanService.edit(payload).then(response => {
      return response
    })
  },
  // eslint-disable-next-line no-empty-pattern
  async delete({  }, id) {
    return await mealPlanService.delete(id).then(response => {
      return response
    })
  },
};

const mutations = {
  SET_MEAL_PLAN: (state, mealPlan) => {
    excludedFilter(mealPlan, ['message'])
    state.mealPlan = mealPlan
  },
};

export const mealPlan = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
