const state = () => ({
  alerts: [],
  snackbars: []
});

const actions = {
  setAlert: ({ commit }, alert) => {
    alert.active = true
    commit('SET_ALERT', alert)
  },
  setSnackbar: ({ commit }, snackbar) => {
    snackbar.active = true
    snackbar.color = snackbar.color || 'primary'
    snackbar.timeout = snackbar.timeout || 5000
    snackbar.createdAt = new Date().getTime()
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

export const notifications = {
  namespaced: true,
  state,
  actions,
  mutations
};
