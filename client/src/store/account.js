import { BehaviorSubject } from "rxjs"
import { accountService } from '@/services'
import { getToken, getUser, tokenExpirationTime } from "@/utils/storage"
import { excludedFilter } from "@/utils/filters";

const user = new BehaviorSubject(getUser())
const token = new BehaviorSubject(getToken())

const state = () => ({
  user,
  token,
  users: [],
  loading: false
})
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
    return accountService.register(user).finally(() => commit('SET_LOADING_STATUS', true))
  },
  async login ({ commit }, { email, password }) {
    return await accountService.login(email, password).then(response => {
      const expires = tokenExpirationTime(response.data)
      const jwtToken = {
        token: response.data.jwtToken,
        expires
      }
      commit('SET_USER', response.data)
      commit('SET_TOKEN', jwtToken)
      return response
    })
  },
  logout: async ({ commit }) => {
    return accountService.logout().finally(() => commit('LOGOUT_USER'))
  },
  verifyEmail: async ({ commit }, token) => {
    commit('SET_LOADING_STATUS', true)
    return accountService.verifyEmail(token).finally(() => commit('SET_LOADING_STATUS', true))
  },
  forgotPassword: async ({ commit }, email) => {
    commit('SET_LOADING_STATUS', true)
    return accountService.forgotPassword(email).finally(() => commit('SET_LOADING_STATUS', true))
  },
  validateResetToken: async ({ commit }, token) => {
    commit('SET_LOADING_STATUS', true)
    return accountService.validateResetToken(token).finally(() => commit('SET_LOADING_STATUS', true))
  },
  resetPassword: async ({ commit }, { token, password, passwordConfirm }) => {
    commit('SET_LOADING_STATUS', true)
    return accountService.resetPassword(token, password, passwordConfirm).finally(() => commit('SET_LOADING_STATUS', true))
  },
  getById: ({ commit }, id) => {
    return accountService.getById(id).then(response => {
      commit('SET_USER', response.data)
      return response
    })
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
  update: async ({ commit }, user) => {
    return await accountService.update(user.id, user).then(response => {
      commit('SET_USER', response.data)
      return response
    })
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
  }
}

const mutations = {
  SET_USER: (state, response) => {
    const excludedKeys = ['message', 'jwtToken']
    const user = excludedFilter(response, excludedKeys)
    localStorage.setItem('user', JSON.stringify(user))
    state.user.next(user)
  },
  SET_TOKEN: (state, jwtToken) => {
    localStorage.setItem('jwtToken', JSON.stringify(jwtToken))
    state.token.next(jwtToken)
  },
  LOGOUT_USER: (state) => {
    localStorage.removeItem('user')
    localStorage.removeItem('jwtToken')
    state.user.next(null)
    state.token.next(null)
  },
  SET_USERS: (state, users) => {
    state.users = users
  },
  SET_LOADING_STATUS: (state, status) => {
    state.loading = status
  }
};

export const account = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
