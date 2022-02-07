import {getApplication} from "@/utils/storage";

const state = () => ({
  application: {
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false
  }
});

const getters = {
  getApplication: (state) => state.application
}

const actions = {
  init: async ({ commit, state }, application) => {
    const requiredFields = new Map(Object.entries(application || state.application))
    const undefinedFields = new Map()
    const definedFields = new Map()
    const storageApplication = getApplication()

    if (storageApplication) {
      requiredFields.forEach((value, key) => {
        if (!(key in storageApplication) || typeof storageApplication?.[key] !== "boolean") {
          undefinedFields.set(key, value)
        } else {
          definedFields.set(key, storageApplication?.[key])
        }
      })

      if (definedFields.size !== requiredFields.size) {
        commit('SET_REQUIRED_FIELDS', { undefinedFields, definedFields })
      } else {
        commit('SET_APPLICATION_FIELDS', definedFields)
      }
    } else {
      commit('SET_STORAGE_FIELDS', application || state.application)
    }
  },
  update: ({ commit }, application) => {
    commit('SET_STORAGE_FIELDS', application)
  }
};

const mutations = {
  SET_REQUIRED_FIELDS: (state, { undefinedFields, definedFields }) => {
    if (definedFields.size) {
      definedFields.forEach((value, key) => {
        state.application = { ...state.application, [key]: value }
      })
    }
    undefinedFields.forEach((value, key) => {
      state.application = { ...state.application, [key]: value }
    })
    const objUndefinedFields = Object.fromEntries(undefinedFields)
    const objDefinedFields = Object.fromEntries(definedFields)
    const storageObjFields = Object.assign({}, objUndefinedFields, objDefinedFields)
    localStorage.setItem('application', JSON.stringify(storageObjFields))
  },
  SET_STORAGE_FIELDS: (state, application) => {
    state.application = application
    localStorage.setItem('application', JSON.stringify(application))
  },
  SET_APPLICATION_FIELDS: (state, application) => {
    application.forEach((value, key) => {
      state.application = { ...state.application, [key]: value }
    })
  }
};

export const application = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
