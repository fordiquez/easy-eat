import { mealPlanService } from '@/services'

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
  async getPlans({ commit }) {
    return await mealPlanService.getAll().then(response => {
      console.log(response)
      commit('SET_PLANS', response.data)
    }).catch(error => {
      console.log(error.response)
    })
  },
  setSelectedPlan({ commit }, selectedDiet) {
    commit('SET_SELECTED_PLAN', selectedDiet)
  }
};

const mutations = {
  SET_PLANS: (state, plans) => {
    state.plans = plans
  },
  SET_SELECTED_PLAN: (state, selectedPlan) => {
    Object.assign(state.selectedPlan, selectedPlan)
  }
};

export const mealPlan = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
