import moment from "moment";
import { foodService } from '@/services'

const state = () => ({
  foundFood: [],
  userFood: [],
  links: [],
  currentPage: 1,
  mealTime: '',
  categories: [
    {
      title: 'Generic Foods',
      value: 'generic-foods',
      description: 'Any general non-branded food i.e. searching “apple” with this category returns information on generic “apple” and its varieties'
    },
    {
      title: 'Packaged Foods',
      value: 'packaged-foods',
      description: 'Any food that has been produced as a Consumer Packaged Good (CPG,) i.e. one of the results when searching “apple” returns an “Apple” packaged and branded from “Apple Country'
    },
    {
      title: 'Generic Meals',
      value: 'generic-meals',
      description: 'Any generic (non-branded) food that is composed of other basic foods, these will usually come with a list of ingredients. i.e. searching “apple” returns “Apple-Crisp Baked Apples'
    },
    {
      title: 'Fast Foods',
      value: 'fast-foods',
      description: 'Any food that is served by a chain-restaurant. i.e. searching “apple” returns “Apples” which are served by “bareburger”'
    },
  ],
  healthLabels: [
    {
      title: 'Alcohol-free',
      value: 'alcohol-free',
      description: 'No alcohol used or contained',
    },
    {
      title: 'Immune-Supportive',
      value: 'immuno-supportive',
      description: 'Recipes which fit a science-based approach to eating to strengthen the immune system',
    },
    {
      title: 'Celery-free',
      value: 'celery-free',
      description: 'Does not contain celery or derivatives',
    },
    {
      title: 'Crustcean-free',
      value: 'crustacean-free',
      description: 'Does not contain crustaceans (shrimp, lobster etc.) or derivatives',
    },
    {
      title: 'Dairy',
      value: 'dairy-free',
      description: 'No dairy; no lactose',
    },
    {
      title: 'Eggs',
      value: 'egg-free',
      description: 'No eggs or products containing eggs',
    },
    {
      title: 'Fish',
      value: 'fish-free',
      description: 'No fish or fish derivatives',
    },
    {
      title: 'FODMAP free',
      value: 'fodmap-free',
      description: 'Does not contain FODMAP foods',
    },
    {
      title: 'Gluten',
      value: 'gluten-free',
      description: 'No ingredients containing gluten',
    },
    {
      title: 'Keto',
      value: 'keto-friendly',
      description: 'Maximum 7 grams of net carbs per serving',
    },
    {
      title: 'Kidney friendly',
      value: 'kidney-friendly',
      description: 'Per serving – phosphorus less than 250 mg AND potassium less than 500 mg AND sodium less than 500 mg',
    },
    {
      title: 'Kosher',
      value: 'kosher',
      description: 'Contains only ingredients allowed by the kosher diet. However it does not guarantee kosher preparation of the ingredients themselves',
    },
    {
      title: 'Low potassium',
      value: 'low-potassium',
      description: 'Less than 150mg per serving',
    },
    {
      title: 'Lupine-free',
      value: 'lupine-free',
      description: 'Does not contain lupine or derivatives',
    },
    {
      title: 'Mustard-free',
      value: 'mustard-free',
      description: 'Does not contain mustard or derivatives',
    },
    {
      title: 'Low-fat-abs',
      value: 'low-fat-abs',
      description: 'Less than 3g of fat per serving',
    },
    {
      title: 'No oil added',
      value: 'No-oil-added',
      description: 'No oil added except to what is contained in the basic ingredients',
    },
    {
      title: 'No-sugar',
      value: 'low-sugar',
      description: 'No simple sugars – glucose, dextrose, galactose, fructose, sucrose, lactose, maltose',
    },
    {
      title: 'Paleo',
      value: 'paleo',
      description: 'Excludes what are perceived to be agricultural products; grains, legumes, dairy products, potatoes, refined salt, refined sugar, and processed oils',
    },
    {
      title: 'Peanuts',
      value: 'peanut-free',
      description: 'No peanuts or products containing peanuts',
    },
    {
      title: 'Pescatarian',
      value: 'pecatarian',
      description: 'Does not contain meat or meat based products, can contain dairy and fish',
    },
    {
      title: 'Pork-free',
      value: 'pork-free',
      description: 'Does not contain pork or derivatives',
    },
    {
      title: 'Red meat-free',
      value: 'red-meat-free',
      description: 'Does not contain beef, lamb, pork, duck, goose, game, horse, and other types of red meat or products containing red meat',
    },
    {
      title: 'Sesame-free',
      value: 'sesame-free',
      description: 'Does not contain sesame seed or derivatives',
    },
    {
      title: 'Shellfish',
      value: 'shellfish-free',
      description: 'No shellfish or shellfish derivatives',
    },
    {
      title: 'Soy',
      value: 'soy-free',
      description: 'No soy or products containing soy',
    },
    {
      title: 'Sugar-conscious',
      value: 'sugar-conscious',
      description: 'Less than 4g of sugar per serving',
    },
    {
      title: 'Tree Nuts',
      value: 'tree-nut-free',
      description: 'No tree nuts or products containing tree nuts',
    },
    {
      title: 'Vegan',
      value: 'vegan',
      description: 'No meat, poultry, fish, dairy, eggs or honey',
    },
    {
      title: 'Vegetarian',
      value: 'vegetarian',
      description: 'No meat, poultry, or fish',
    },
    {
      title: 'Wheat-free',
      value: 'wheat-free',
      description: 'No wheat, can have gluten though',
    },
  ],
  mealtimes: {
    labels: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    icons: ['mdi-pot-steam', 'mdi-weather-sunny', 'mdi-weather-night', 'mdi-food-apple']
  },
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
  getFoundFood: state => state.foundFood.filter((value, index, self) => self.findIndex(item => item.food.foodId === value.food.foodId) === index),
  getCurrentPageFood: (state, getters) => getters.getFoundFood.slice(state.currentPage * 20 - 20, state.currentPage * 20),
  getUserFood: state => state.userFood.filter(item => moment(item.date).format('yyyy-MM-DD') === state.selectedDate),
  getCategories: state => state.categories,
  getHealthLabels: state => state.healthLabels,
  getMealTimes: state => state.mealtimes,
  getMealTime: state => state.mealTime,
  getDate: state => state.selectedDate,
  getDailyMacros: state => state.dailyMacros,
  getLinks: state => state.links
}

const actions = {
  async searchParser({ commit }, params) {
    return await foodService.searchParser(params).then(response => {
      commit('CLEAR_FOUND_FOOD')
      commit('CLEAR_LINKS')
      commit('SET_FOUND_FOOD', response.data)
      commit('SET_LINKS', response.data)
      return response
    })
  },
  async searchNextPage({ commit }, nextUrl) {
    return await foodService.searchNextPage(nextUrl).then(response => {
      commit('SET_FOUND_FOOD', response.data)
      commit('SET_LINKS', response.data)
      return response
    })
  },
  async add({ commit }, payload) {
    return await foodService.add(payload).then(response => {
      commit('SET_USER_FOOD', response.data.food)
      commit('SET_DAILY_MACROS', response.data.food)
      return response
    })
  },
  async get({ commit, rootGetters }) {
    return await foodService.get({ accountId: rootGetters["account/getUserValue"].id }).then(response => {
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
  async delete({ commit }, selectedFood) {
    return await foodService.delete(selectedFood.id, { accountId: selectedFood.accountId }).then(response => {
      commit('DELETE_DAILY_MACROS', selectedFood.id)
      commit('DELETE_USER_FOOD', selectedFood.id)
      return response
    })
  },
  async bulkDelete({ commit }, params) {
    return await foodService.bulkDelete(params).then(response => {
      commit('CLEAR_DAILY_MACROS')
      commit('CLEAR_USER_FOOD')
      return response
    })
  },
  setCurrentPage: ({ commit }, pageNumber) => commit('SET_CURRENT_PAGE', pageNumber),
  selectedMealTime: ({ commit }, mealTime) => commit('SET_MEAL_TIME', mealTime),
  selectedDate: ({ commit }, date) => commit('SET_DATE', date),
  setSelectedNutrients: ({ commit }, nutrients) => commit('SET_SELECTED_NUTRIENTS', nutrients),
  setDailyMacros: ({ commit }, userFood) => commit('SET_DAILY_MACROS', userFood),
  updateDailyMacros: ({ commit }, foodItem) => commit('UPDATE_DAILY_MACROS', foodItem),
  clearDailyMacros: ({ commit }) => commit('CLEAR_DAILY_MACROS'),
  clearFoundFood: ({ commit }) => commit('CLEAR_FOUND_FOOD'),
  clearUserFood: ({ commit }) => commit('CLEAR_USER_FOOD'),
  clearLinks: ({ commit }) => commit('CLEAR_LINKS')
};

const mutations = {
  SET_FOUND_FOOD: (state, { hints }) => {
    const uniqueHints = hints.filter((value, index, self) => self.findIndex((item) => item.food.foodId === value.food.foodId) === index)
    uniqueHints.forEach(hint => state.foundFood.push(hint))
  },
  SET_LINKS: (state, { _links }) => state.links.push(_links.next.href),
  CLEAR_FOUND_FOOD: state => state.foundFood = [],
  CLEAR_LINKS: state => state.links = [],
  SET_CURRENT_PAGE: (state, number) => state.currentPage = number,
  SET_USER_FOOD: (state, userFood) => {
    if (Array.isArray(userFood)) {
      state.userFood = []
      userFood.forEach(food => state.userFood.push(food))
    } else state.userFood.push(userFood)
  },
  DELETE_USER_FOOD: (state, id) => {
    const foodIndex = state.userFood.findIndex(item => item.id === id)
    state.userFood.splice(foodIndex, 1)
  },
  CLEAR_USER_FOOD: state => state.userFood = [],
  SET_MEAL_TIME: (state, mealTime) => state.mealTime = mealTime,
  SET_DATE: (state, date) => state.selectedDate = date,
  SET_SELECTED_NUTRIENTS: (state, nutrients) => {
    state.selectedNutrients = Object.assign({}, nutrients)
  },
  SET_DAILY_MACROS: (state, userFood) => {
    if (Array.isArray(userFood)) {
      userFood.forEach(food => {
        state.dailyMacros.CARBS += food.nutrients.CARBS
        state.dailyMacros.PROTEIN += food.nutrients.PROTEIN
        state.dailyMacros.FAT += food.nutrients.FAT
        state.dailyMacros.CALS += food.nutrients.CALS
      })
    } else {
      state.dailyMacros.CARBS += userFood.nutrients.CARBS
      state.dailyMacros.PROTEIN += userFood.nutrients.PROTEIN
      state.dailyMacros.FAT += userFood.nutrients.FAT
      state.dailyMacros.CALS += userFood.nutrients.CALS
    }
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
  CLEAR_DAILY_MACROS: state => state.dailyMacros.CARBS = state.dailyMacros.PROTEIN = state.dailyMacros.FAT = state.dailyMacros.CALS = 0
};

export const food = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
