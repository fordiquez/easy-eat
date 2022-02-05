import { productService } from '@/services'

const state = {
  foundProduct: null,
  status: {
    loading: false,
    success: false,
    error: false
  },
  response: {
    status: undefined,
    message: null
  }
};

const actions = {
  async search({ commit }, options) {
    commit('SET_LOADING_STATUS', true)
    console.log(options)
    return await productService.search(options).then(response => {
      console.log(response)
      commit('SET_PRODUCT', response.data);
      commit('SET_SUCCESS_STATUS', { status: true, message: response.data.message })
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
};

const mutations = {
  SET_LOADING_STATUS: (state, status) => {
    state.status.loading = status
  },
  SET_SUCCESS_STATUS: (state, { status, message }) => {
    state.status.success = status
    state.status.error = !status
    state.response.message = message
  },
  SET_ERROR_STATUS: (state, { status, message }) => {
    state.status.error = status
    state.status.success = !status
    state.response.message = message
  },
  SET_PRODUCT(state, { calories, totalWeight, dietLabels, healthLabels, cautions, totalNutrients, totalDaily }) {
    state.foundProduct = { calories, totalWeight, dietLabels, healthLabels, cautions, totalNutrients, totalDaily };
  }
};

export const product = {
  namespaced: true,
  state,
  actions,
  mutations
};
