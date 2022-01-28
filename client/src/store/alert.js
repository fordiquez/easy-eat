import Swal from "sweetalert2";

const state = {
  icon: null,
  title: null
};

const actions = {
  success: ({ commit }, { message }) => {
    commit('SET_SUCCESS_ALERT', message);
    commit('SET_ALERT');
  },
  error: ({ commit }, { message }) => {
    commit('SET_ERROR_ALERT', message);
    commit('SET_ALERT');
  },
  clear: ({ commit }, message) => {
    commit('CLEAR_ALERT', message);
  }
};

const mutations = {
  SET_SUCCESS_ALERT: (state, message) => {
    state.icon = 'success';
    state.title = message;
  },
  SET_ERROR_ALERT: (state, message) => {
    state.icon = 'error';
    state.title = message;
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
    state.icon = null;
    state.title = null;
  },
};

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations
};
