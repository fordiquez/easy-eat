import { userDataService } from '@/services'
import { BehaviorSubject } from "rxjs";
import { excludedFilter } from "@/utils/filters";

const state = () => ({
  userData: new BehaviorSubject(null)
});

const getters = {
  getUserData: state => state.userData.asObservable()
}

const actions = {
  async create({ commit }, payload) {
    return await userDataService.create(payload).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  async getById({ commit }, id) {
    return await userDataService.getById(id).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  async update({ commit }, payload) {
    return await userDataService.edit(payload).then(response => {
      commit('SET_USER_DATA', response.data.userData)
      return response
    })
  },
  async delete({ commit }, id) {
    return await userDataService.delete(id).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  }
};

const mutations = {
  SET_USER_DATA: (state, userData) => {
    state.userData.next(excludedFilter(userData, ['message']))
  }
};

export const userData = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
