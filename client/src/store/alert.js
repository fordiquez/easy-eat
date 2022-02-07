import Swal from "sweetalert2"

const state = () => ({
  status: {
    loading: false,
    error: false,
    success: false,
    info: false
  },
  message: {
    error: null,
    success: null,
    info: null
  },
});

const actions = {
  loading: ({ commit }, status) => {
    commit('SET_LOADING_STATUS', status)
  },
  error: ({ commit }, { status, message }) => {
    commit('SET_ERROR_ALERT', { status, message })
  },
  success: ({ commit }, { status, message }) => {
    commit('SET_SUCCESS_ALERT', { status, message })
  },
  info: ({ commit }, { status, message }) => {
    commit('SET_INFO_ALERT', { status, message })
  },
  clear: ({ commit }) => {
    commit('CLEAR_ALERT');
  }
};

const mutations = {
  SET_LOADING_STATUS: (state, status) => {
    state.status.loading = status
  },
  SET_ERROR_ALERT: (state, { status, message }) => {
    state.status.error = status
    state.status.success = !status
    state.message.error = message
  },
  SET_SUCCESS_ALERT: (state, { status, message }) => {
    state.status.success = status
    state.status.error = !status
    state.message.success = message
  },
  SET_INFO_ALERT: (state, { status, message }) => {
    state.status.info = status
    state.message.info = message
  },
  SET_ALERT: (state) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      title: state.title,
      icon: state.icon,
      width: '26rem'
    });
  },
  CLEAR_ALERT: (state) => {
    state.status.error = state.status.info = state.status.loading = state.status.success = false
    state.message.error = state.message.info = state.message.success = null
  },
};

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations
};
