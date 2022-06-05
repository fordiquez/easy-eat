import { BehaviorSubject } from "rxjs"
import { accountService } from '@/services'
import { getToken, getUser, tokenExpirationTime } from "@/utils/storage"
import { excludedFilter } from "@/utils/filters";

const user = new BehaviorSubject(getUser())
const token = new BehaviorSubject(getToken())

const state = () => ({
  user,
  token,
  users: []
})
const getters = {
  getUser: state => state.user.asObservable(),
  getUserValue: state => state.user.value,
  getToken: state => state.token.asObservable(),
  getTokenValue: state => state.token.value,
  getUsers: state => state.users
}

const actions = {
  // eslint-disable-next-line no-empty-pattern
  register: async ({  }, user) => {
    return accountService.register(user)
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
    return accountService.logout().finally(() => {
      commit('LOGOUT_USER')
      // dispatch('food/clearUserFood', { root: true })
      // commit('userData/CLEAR_USER_DATA', { root: true })
      // commit('mealPlan/CLEAR_SELECTED_PLAN', { root: true })
    })
  },
  // eslint-disable-next-line no-empty-pattern
  verifyEmail: async ({  }, token) => {
    return accountService.verifyEmail(token)
  },
  // eslint-disable-next-line no-empty-pattern
  forgotPassword: async ({  }, email) => {
    return accountService.forgotPassword(email)
  },
  // eslint-disable-next-line no-empty-pattern
  validateResetToken: async ({  }, token) => {
    return accountService.validateResetToken(token)
  },
  // eslint-disable-next-line no-empty-pattern
  resetPassword: async ({  }, { token, password, passwordConfirm }) => {
    return accountService.resetPassword(token, password, passwordConfirm)
  },
  getById: ({ commit }, id) => {
    return accountService.getById(id).then(response => {
      commit('SET_USER', response.data)
      return response
    })
  },
  getAll: async ({ commit }) => {
    return await accountService.getAll().then(response => {
      commit('SET_USERS', response.data)
      return response
    })
  },
  create: async ({ commit }, user) => {
    return await accountService.create(user).then(response => {
      commit('SET_CREATED_USER', response.data)
      return response
    })
  },
  update: async ({ commit, getters }, user) => {
    return await accountService.update(user.id, user).then(response => {
      if (response.data.id === getters.getUserValue.id) {
        commit('SET_USER', response.data)
        if (getters.getUsers.length) {
          commit('SET_UPDATED_USER', response.data)
        }
      } else {
        commit('SET_UPDATED_USER', response.data)
      }
      return response
    })
  },
  delete: async ({ commit, getters }, id) => {
    return await accountService.delete(id).then(response => {
      getters.getUserValue.id === id ? commit('LOGOUT_USER') : commit('SET_DELETED_USER', id)
      return response
    })
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
    state.users = []
  },
  SET_USERS: (state, users) => {
    state.users = users
  },
  SET_CREATED_USER: (state, response) => {
    const user = excludedFilter(response, ['message'])
    state.users.push(user)
  },
  SET_UPDATED_USER: (state, response) => {
    const user = excludedFilter(response, ['message'])
    const userIndex = state.users.findIndex(item => item.id === user.id)
    Object.assign(state.users[userIndex], user)
  },
  SET_DELETED_USER: (state, id) => {
    const userIndex = state.users.findIndex(item => item.id === id)
    state.users.splice(userIndex, 1)
  }
};

export const account = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
