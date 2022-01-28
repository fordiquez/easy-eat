import { productService } from '@/services'

const state = {
  results: null
};

const actions = {
  search({ dispatch, commit }, query) {
    console.log(query)
    productService.search(query)
      .then(
        results => {
          console.log(results)
          commit('productRequest', results);
        },
        error => {
          console.log(error)
          // commit('loginFailure', error);
          // dispatch('alert/error', error, { root: true });
        }
      );
  },
};

const mutations = {
  productRequest(state, results) {
    state.results = results;
  }
};

export const products = {
  namespaced: true,
  state,
  actions,
  mutations
};
