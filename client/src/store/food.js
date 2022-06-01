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
  selectedDate: moment().format('yyyy-MM-DD'),
  selectedNutrients: {},
  dailyMacros: {
    CARBS: 0,
    PROTEIN: 0,
    FAT: 0,
    CALS: 0
  },
});

const getters = {
  getFoundFood: state => state.foundFood.filter((value, index, self) => self.findIndex((item) => item.food.foodId === value.food.foodId) === index),
  getUserFood: state => state.userFood.filter(item => moment(item.date).format('yyyy-MM-DD') === state.selectedDate),
  getMealTimes: state => state.mealtimes,
  getMealTime: state => state.mealTime,
  getDate: state => state.selectedDate,
  getDailyMacros: state => state.dailyMacros
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
      commit('ADD_DAILY_MACROS', response.data)
      return response
    })
  },
  async get({ commit, rootGetters }) {
    return await foodService.get({ account: rootGetters["account/getUserValue"].id }).then(response => {
      commit('SET_USER_FOOD', response.data)
      return response
    })
  },
  async update({ commit }, payload) {
    return await foodService.update(payload).then(response => {
      commit('UPDATE_DAILY_MACROS', response.data)
      return response
    })
  },
  async delete({ commit }, id) {
    return await foodService.delete(id).then(response => {
      commit('DELETE_DAILY_MACROS', id)
      commit('SET_DELETED_FOOD', id)
      return response
    })
  },
  selectedMealTime({ commit }, mealTime) {
    commit('SET_MEAL_TIME', mealTime)
  },
  selectedDate({ commit }, date) {
    commit('SET_DATE', date)
  },
  setSelectedNutrients({ commit }, nutrients) {
    commit('SET_SELECTED_NUTRIENTS', nutrients)
  },
  setDailyMacros({ commit }, userFood) {
    commit('SET_DAILY_MACROS', userFood)
  },
  updateDailyMacros({ commit }, foodItem) {
    commit('UPDATE_DAILY_MACROS', foodItem)
  },
  clearDailyMacros({ commit }) {
    commit('CLEAR_DAILY_MACROS')
  }
};

const mutations = {
  SET_FOUND_FOOD: (state, { hints }) => {
    state.foundFood = hints
  },
  SET_USER_FOOD: (state, data) => {
    state.userFood = []
    data.forEach(food => {
      state.userFood.push(food)
    })
  },
  SET_ADDED_FOOD: (state, { food }) => {
    state.userFood.push(food)
  },
  SET_DELETED_FOOD: (state, id) => {
    const foodIndex = state.userFood.findIndex(item => item.id === id)
    state.userFood.splice(foodIndex, 1)
  },
  SET_MEAL_TIME: (state, mealTime) => {
    state.mealTime = mealTime
  },
  SET_DATE: (state, date) => {
    state.selectedDate = date
  },
  SET_SELECTED_NUTRIENTS: (state, nutrients) => {
    state.selectedNutrients = Object.assign({}, nutrients)
  },
  SET_DAILY_MACROS: (state, userFood) => {
    userFood.forEach(food => {
      state.dailyMacros.CARBS += food.nutrients.CARBS
      state.dailyMacros.PROTEIN += food.nutrients.PROTEIN
      state.dailyMacros.FAT += food.nutrients.FAT
      state.dailyMacros.CALS += food.nutrients.CALS
    })
  },
  ADD_DAILY_MACROS: (state, { food }) => {
    state.dailyMacros.CARBS += food.nutrients.CARBS
    state.dailyMacros.PROTEIN += food.nutrients.PROTEIN
    state.dailyMacros.FAT += food.nutrients.FAT
    state.dailyMacros.CALS += food.nutrients.CALS
  },
  DELETE_DAILY_MACROS: (state, id) => {
    const food = state.userFood.find(item => item.id === id)
    state.dailyMacros.CARBS -= food.nutrients.CARBS
    state.dailyMacros.PROTEIN -= food.nutrients.PROTEIN
    state.dailyMacros.FAT -= food.nutrients.FAT
    state.dailyMacros.CALS -= food.nutrients.CALS
  },
  UPDATE_DAILY_MACROS: (state, { food }) => {
    const [diffCARBS, diffPROTEIN, diffFAT, diffCALS] = [
      food.nutrients.CARBS - state.selectedNutrients.CARBS,
      food.nutrients.PROTEIN - state.selectedNutrients.PROTEIN,
      food.nutrients.FAT - state.selectedNutrients.FAT,
      food.nutrients.CALS - state.selectedNutrients.CALS]
    state.dailyMacros.CARBS += diffCARBS
    state.dailyMacros.PROTEIN += diffPROTEIN
    state.dailyMacros.FAT += diffFAT
    state.dailyMacros.CALS += diffCALS
  },
  CLEAR_DAILY_MACROS: (state) => {
    state.dailyMacros.CARBS = state.dailyMacros.PROTEIN = state.dailyMacros.FAT = state.dailyMacros.CALS = 0
  }
};

export const food = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
