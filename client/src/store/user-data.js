import { userDataService } from '@/services'
import { BehaviorSubject } from "rxjs";
import { excludedFilter } from "@/utils/filters";

const state = () => ({
  userData: new BehaviorSubject(null),
  activities: {
    labels: ['Sedentary', 'Light', 'Moderate', 'Very', 'Extra'],
    titles: ['Sedentary', 'Lightly Active', 'Moderate Active', 'Very Active', 'Extra Active'],
    descriptions: [
      'Desk job with little or no exercise.',
      'Work a job with light physical demands, or work a desk job and perform light exercise (at the level of a brisk walk) for 30 minutes per day, 3-5 times per week.',
      'Work a moderately physically demanding job, such as construction worker, or work a desk job and engage in moderate exercise for 1 hour per day, 3-5 times per week.',
      'Work a consistently physically demanding job, such as agricultural worker, or work a desk job and engage in intense exercise for 1 hour per day, or moderate exercise for 2 hours per day, 5-7 times per week.',
      'Work an extremely physically demanding job, such as professional athlete, competitive cyclist, or fitness professional, or engage in intense exercise for at least 2 hours per day.'
    ]
  },
});

const getters = {
  getUserData: state => state.userData.asObservable(),
  getUserDataValue: state => state.userData.value,
  getActivities: state => state.activities
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
      console.log(response)
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  async update({ commit }, payload) {
    return await userDataService.update(payload).then(response => {
      commit('SET_USER_DATA', response.data.userData)
      return response
    })
  },
  async delete({ commit }, id) {
    return await userDataService.delete(id).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  clearUserData: ({ commit }) => commit('CLEAR_USER_DATA')
};

const mutations = {
  SET_USER_DATA: (state, userData) => {
    state.userData.next(excludedFilter(userData, ['message']))
  },
  CLEAR_USER_DATA: state => state.userData.next(null)
};

export const userData = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
