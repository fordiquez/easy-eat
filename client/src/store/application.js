import { getApplication } from "@/utils/storage";

const state = () => ({
  application: {
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false
  }
});

const getters = {
  getApplication: (state) => state.application
}

const actions = {
  init: ({ commit, state }, application) => {
    const requiredFields = application || state.application
    const undefinedFields = {}
    const definedFields = {}
    const storageApplication = getApplication()

    if (storageApplication) {
      Object.entries(requiredFields).forEach(([key, value]) => {
        if (!(key in storageApplication) || typeof storageApplication[key] !== "boolean") {
          undefinedFields[key] = value
        } else {
          definedFields[key] = storageApplication[key]
        }
      })
      if (Object.keys(definedFields).length !== Object.keys(requiredFields).length) {
        commit('SET_REQUIRED_FIELDS', { undefinedFields, definedFields })
      } else {
        commit('SET_APPLICATION_FIELDS', definedFields)
      }
    } else {
      commit('SET_STORAGE_FIELDS', requiredFields)
    }
  },
  update: ({ commit }, application) => {
    commit('SET_STORAGE_FIELDS', application)
  }
};

const mutations = {
  SET_REQUIRED_FIELDS: (state, { undefinedFields, definedFields }) => {
    if (Object.keys(definedFields).length) {
      for (let [key, value] of Object.entries(definedFields)) {
        state.application = { ...state.application, [key]: value }
      }
    }
    for (let [key, value] of Object.entries(undefinedFields)) {
      state.application = { ...state.application, [key]: value }
    }
    const storageFields = Object.assign({}, undefinedFields, definedFields)
    localStorage.setItem('application', JSON.stringify(storageFields))
  },
  SET_STORAGE_FIELDS: (state, application) => {
    state.application = application
    localStorage.setItem('application', JSON.stringify(application))
  },
  SET_APPLICATION_FIELDS: (state, application) => {
    for (let [key, value] of Object.entries(application)) {
      state.application = { ...state.application, [key]: value }
    }
  }
};

export const application = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
