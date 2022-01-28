import { accountService } from '@/services';
import { DefaultAPIInstance } from "@/helpers/axios-instances";
import { getToken, getUser, tokenExpirationTime } from "@/helpers/authorization";
import { BehaviorSubject } from "rxjs";

const user = new BehaviorSubject(getUser())
const token = getToken()

const state = {
  user,
  token,
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
  getUser: (state) => {
    // return accountService.currentUser.subscribe(user => state.user = user);
    return state.user.asObservable()
  },
  getUserValue: (state) => {
    return state.user.value
  },
  getToken: (state) => {
    return state.token
  }
}

const actions = {
  register: async ({ dispatch, commit }, user) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.register(user).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  login: async ({dispatch, commit}, {email, password}) => {
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
  verifyEmail: async ({commit}, token) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.verifyEmail(token).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  forgotPassword: async ({commit}, email) => {
    commit('SET_LOADING_STATUS', true)
    return await accountService.forgotPassword(email).then(res => {
      commit('SET_SUCCESS_STATUS', { status: true, message: res.data.message })
    }).catch(error => {
      console.log(error.response)
      commit('SET_ERROR_STATUS', { status: true, message: error.response.data.message })
    }).finally(() => commit('SET_LOADING_STATUS', false))
  },
  validateResetToken: async ({commit}, token) => {
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
    return await accountService.refreshToken().then(res => {
    }).catch(error => {
      console.log(error)
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
    state.token = jwtToken
  },
  LOGOUT: (state) => {
    localStorage.removeItem('user')
    localStorage.removeItem('jwtToken')
    state.user.next(null)
    state.token = null
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
