import { v4 as uuidv4 } from 'uuid'

const state = () => ({
  alerts: [],
  snackbars: []
});

const getters = {
  activeAlerts: state => state.alerts.filter(alert => alert.active && alert.createdAt > new Date().getTime() - alert.timeout),
  activeSnackbars: state => state.snackbars.filter(snackbar => snackbar.active && snackbar.createdAt > new Date().getTime() - snackbar.timeout)
}

const actions = {
  setAlert: ({ commit }, alert) => {
    alert.id = uuidv4()
    alert.active = true
    alert.timeout = alert.timeout || 10000
    alert.createdAt = new Date().getTime()
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
  clearAlerts: ({ commit }) => commit('CLEAR_ALERTS')
};

const mutations = {
  SET_ALERT: (state, alert) => state.alerts = state.alerts.concat(alert),
  SET_SNACKBAR: (state, snackbar) => state.snackbars = state.snackbars.concat(snackbar),
  CLEAR_ALERTS: state => state.alerts = []
};

export const notification = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
