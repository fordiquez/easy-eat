import { BehaviorSubject } from "rxjs";
import { accountService } from '@/services';
import { DefaultAPIInstance } from "@/utils/axios";
import { getToken, getUser, tokenExpirationTime } from "@/utils/storage";

const user = new BehaviorSubject(getUser())
const token = new BehaviorSubject(getToken())

const state = () => ({
  user,
  token,
  users: null,
}
)
const getters = {
  getUser: (state) => state.user.asObservable(),
  getUserValue: (state) => state.user.value,
  getToken: (state) => state.token.asObservable(),
  getTokenValue: (state) => state.token.value,
  getUsers: (state) => state.users
}

const actions = {
  register: async ({ dispatch }, user) => {
    dispatch('alert/loading', true, { root: true })
    return accountService.register(user).finally(() => dispatch('alert/loading', false, { root: true }));
  },
  login: async ({ dispatch, commit }, { email, password }) => {
    dispatch('alert/loading', true, { root: true })
    return await accountService.login(email, password).then(response => {
      const expires = tokenExpirationTime(response.data)
      const jwtToken = {
        token: response.data.jwtToken,
        expires
      }
      dispatch('alert/success', { status: true, message: response.data.message }, { root: true })
      commit('SET_USER', response.data)
      commit('SET_TOKEN', jwtToken)
      return response
    }).catch(error => {
      console.log(error)
      dispatch('alert/error', { status: true, message: error.response.data.message }, { root: true })
      return error.response
    }).finally(() => dispatch('alert/loading', false, { root: true }))
  },
  logout: async ({ dispatch, commit }) => {
    dispatch('alert/loading', true, { root: true })
    return await accountService.logout().then(response => {
      commit('LOGOUT')
      delete DefaultAPIInstance.defaults.headers['authorization']
      dispatch('alert/success', { status: true, message: response.data.message }, { root: true })
    }).catch(error => {
      dispatch('alert/error', { status: true, message: error.response.data.message }, { root: true })
    }).finally(() => dispatch('alert/loading', false, { root: true }))
  },
  verifyEmail: async ({ dispatch }, token) => {
    dispatch('alert/loading', true, { root: true })
    return accountService.verifyEmail(token).finally(async () => dispatch('alert/loading', false, { root: true }));
  },
  forgotPassword: async ({ dispatch }, email) => {
    dispatch('alert/loading', true, { root: true })
    return await accountService.forgotPassword(email).then(response => {
      dispatch('alert/success', { status: true, message: response.data.message }, { root: true })
      return response
    }).catch(error => {
      dispatch('alert/error', { status: true, message: error.response.data.message }, { root: true })
      return error.response
    }).finally(() => dispatch('alert/loading', false, { root: true }))
  },
  validateResetToken: async ({ dispatch }, token) => {
    dispatch('alert/loading', true, { root: true })
    return await accountService.validateResetToken(token).then(response => {
      dispatch('alert/success', { status: true, message: response.data.message }, { root: true })
      return response
    }).catch(error => {
      dispatch('alert/error', { status: true, message: error.response.data.message }, { root: true })
      return error.response
    }).finally(() => dispatch('alert/loading', false, { root: true }))
  },
  resetPassword: async ({ dispatch }, { token, password, passwordConfirm }) => {
    dispatch('alert/loading', true, { root: true })
    return accountService.resetPassword(token, password, passwordConfirm).finally(() => dispatch('alert/loading', false, {root: true }));
  },
  refreshToken: async ({ commit }) => {
    commit('SET_LOADING_STATUS', true)
    await accountService.refreshToken().then(res => {
      console.log(res)
      return res
    }).catch(error => {
      console.log(error)
      return error
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  getAll: async ({ commit }) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.getAll().then(res => {
      console.log(res)
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
      commit('SET_USERS', res.data)
      return Promise.resolve(res)
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
      return error
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  create: async ({ commit }, user) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.create(user).then(res => {
      console.log(res)
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  getById: async ({ commit }, id) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.getById(id).then(res => {
      console.log(res)
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
      return res
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
      return error
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  update: async ({ commit }, { id, firstName, lastName, email, password, passwordConfirm, role }) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.update(id, { firstName, lastName, email, password, passwordConfirm, role }).then(res => {
      console.log(res)
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
      return res
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
      return error
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  delete: async ({ commit }, id) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.delete(id).then(res => {
      console.log(res)
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
      if (state.user.value.id === id) commit('LOGOUT')
      return res
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
      return error
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  clear: ({ commit }) => {
    commit('CLEAR_RESPONSE')
  },
}

const mutations = {
  SET_USER: (state, { id, firstName, lastName, email, created, isVerified, role }) => {
    const user = { id, firstName, lastName, email, created, isVerified, role }
    localStorage.setItem('user', JSON.stringify(user))
    state.user.next(user)
  },
  SET_TOKEN: (state, jwtToken) => {
    localStorage.setItem('jwtToken', JSON.stringify(jwtToken))
    state.token.next(jwtToken)
  },
  SET_USERS: (state, users) => {
    state.users = users
  },
  LOGOUT: (state) => {
    localStorage.removeItem('user')
    localStorage.removeItem('jwtToken')
    state.user.next(null)
    state.token.next(null)
  },
  CLEAR_RESPONSE: (state) => {
    state.response.status = undefined
    state.response.message = null
  }
};

export const account = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
