import { foodService } from '@/services'
import moment from "moment";

const state = () => ({
  foundFood: [],
  userFood: [],
  mealtimes: {
    labels: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    icons: ['mdi-pot-steam', 'mdi-weather-sunny', 'mdi-weather-night', 'mdi-food-apple']
  },
  mealTime: '',
  selectedDate: moment().format('yyyy-MM-DD')
});

const getters = {
  getFoundFood: state => state.foundFood.filter((value, index, self) => self.findIndex((item) => item.food.foodId === value.food.foodId) === index),
  getUserFood: state => state.userFood.filter(item => moment(item.date).format('yyyy-MM-DD') === state.selectedDate),
  getMealTimes: state => state.mealtimes,
  getMealTime: state => state.mealTime,
  getDate: state => state.selectedDate
}

const actions = {
  async search({ commit }, query) {
    const options = {
      params: {
        ingr: query,
      }
    }
    return await foodService.search(options).then(response => {
      commit('SET_FOUND_FOOD', response.data);
      return response
    })
  },
  async add({ commit }, payload) {
    return await foodService.add(payload).then(response => {
      commit('SET_ADDED_FOOD', response.data)
      return response
    })
  },
  async get({ commit, rootGetters }) {
    return await foodService.get({ account: rootGetters["account/getUserValue"].id }).then(response => {
      commit('SET_USER_FOOD', response.data)
      return response
    })
  },
  // eslint-disable-next-line no-unused-vars
  async edit({ commit }, payload) {
    return await foodService.edit(payload).then(response => {
      return response
    })
  },
  async delete({ commit }, id) {
    return await foodService.delete(id).then(response => {
      commit('SET_DELETED_FOOD', id)
      return response
    })
  },
  selectedMealTime({ commit }, mealTime) {
    commit('SET_MEAL_TIME', mealTime)
  },
  selectedDate({ commit }, date) {
    commit('SET_DATE', date)
  }
};

const mutations = {
  SET_FOUND_FOOD(state, { hints }) {
    state.foundFood = hints
  },
  SET_USER_FOOD(state, data) {
    state.userFood = []
    data.forEach(food => {
      state.userFood.push(food)
    })
  },
  SET_ADDED_FOOD(state, { food }) {
    state.userFood.push(food)
  },
  SET_DELETED_FOOD(state, id) {
    const foodIndex = state.userFood.findIndex(item => item._id === id)
    state.userFood.splice(foodIndex, 1)
  },
  SET_MEAL_TIME(state, mealTime) {
    state.mealTime = mealTime
  },
  SET_DATE(state, date) {
    state.selectedDate = date
  }
};

export const food = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
