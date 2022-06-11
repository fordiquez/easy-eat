import { v4 as uuidv4 } from 'uuid'

const state = () => ({
  alerts: [],
  snackbars: []
});

const getters = {
  activeSnackbars: state => state.snackbars
}

const actions = {
  setAlert: ({ commit }, alert) => {
    alert.active = true
    commit('SET_ALERT', alert)
  },
  setSnackbar: ({ commit }, snackbar) => {
    snackbar.id = uuidv4()
    snackbar.active = true
    snackbar.color = snackbar.color || 'primary'
    snackbar.timeout = snackbar.timeout || 5000
    snackbar.createdAt = new Date().getTime()
    snackbar.position = snackbar.position || 'bottom'
    commit('SET_SNACKBAR', snackbar)
  },
  clearAlerts: ({ commit }) => {
    commit('CLEAR_ALERTS')
  }
};

const mutations = {
  SET_ALERT: (state, alert) => {
    state.alerts = state.alerts.concat(alert)
  },
  SET_SNACKBAR: (state, snackbar) => {
    state.snackbars = state.snackbars.concat(snackbar)
  },
  CLEAR_ALERTS: (state) => {
    state.alerts = []
  }
};

export const notification = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
