import { accountService } from '@/services';
import { DefaultAPIInstance } from "@/helpers/axios-instances";
import { getToken, getUser, tokenExpirationTime } from "@/helpers/authorization";
import { BehaviorSubject } from "rxjs";

const user = new BehaviorSubject(getUser())
const token = new BehaviorSubject(getToken())

const state = {
  user,
  token,
  users: null,
  status: {
    loading: false,
    success: false,
    error: false
  },
  response: {
    status: undefined,
    message: null
  }
}

const getters = {
  getUser: (state) => state.user.asObservable(),
  getUserValue: (state) => state.user.value,
  getToken: (state) => state.token.asObservable(),
  getTokenValue: (state) => state.token.value,
  getUsers: (state) => state.users
}

const actions = {
  register: async ({ commit }, user) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.register(user).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  login: async ({ commit }, { email, password }) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.login(email, password).then(res => {
      const expires = tokenExpirationTime(res.data)
      const jwtToken = {
        token: res.data.jwtToken,
        expires
      }
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
      commit('SET_USER', res.data)
      commit('SET_TOKEN', jwtToken)
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  logout: async ({ commit }) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.logout().then(res => {
      commit('LOGOUT')
      delete DefaultAPIInstance.defaults.headers['authorization']
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  verifyEmail: async ({ commit }, token) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.verifyEmail(token).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  forgotPassword: async ({ commit }, email) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.forgotPassword(email).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  validateResetToken: async ({ commit }, token) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.validateResetToken(token).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  resetPassword: async ({ commit }, { token, password, passwordConfirm }) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.resetPassword(token, password, passwordConfirm).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
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
  SET_LOADING_STATUS: (state, status) => {
    state.status.loading = status
  },
  SET_SUCCESS_STATUS: (state, { status, message }) => {
    state.status.success = status
    state.status.error = !status
    state.response.message = message
  },
  SET_ERROR_STATUS: (state, { status, message }) => {
    state.status.error = status
    state.status.success = !status
    state.response.message = message
  },
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
