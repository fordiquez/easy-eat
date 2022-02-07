import { DefaultAPIInstance } from "@/utils/axios";
import { tokenExpirationTime } from "@/utils/storage";

const baseURL = '/accounts'

const login = (email, password) => {
  return DefaultAPIInstance.post(`${baseURL}/authenticate`, { email, password }).then(response => {
    DefaultAPIInstance.interceptors.request.use(config => {
      config.headers['Authorization'] = `Bearer ${response.data.jwtToken}`
      return config
    }, error => {
      return Promise.reject(error)
    })
    return response
  }).catch(error => {
    return Promise.reject(error)
  })
}

const logout = () => {
  return DefaultAPIInstance.post(`${baseURL}/revoke-token`, {})
}

const refreshToken = () => {
  return DefaultAPIInstance.post(`${baseURL}/refresh-token`, {}).then(response => {
    tokenExpirationTime(response.data)
    return response
  }).catch(error => {
    return Promise.reject(error)
  })
}

const register = (user) => {
  return DefaultAPIInstance.post(`${baseURL}/register`, user)
}

const verifyEmail = (token) => {
  return DefaultAPIInstance.post(`${baseURL}/verify-email`, { token })
}

const forgotPassword = (email) => {
  return DefaultAPIInstance.post(`${baseURL}/forgot-password`, { email })
}

const validateResetToken = (token) => {
  return DefaultAPIInstance.post(`${baseURL}/validate-reset-token`, { token })
}

const resetPassword = (token, password, passwordConfirm) => {
  return DefaultAPIInstance.post(`${baseURL}/reset-password`, { token, password, passwordConfirm })
}

const getAll = () => {
  return DefaultAPIInstance.get(`${baseURL}/`)
}

const create = (user) => {
  return DefaultAPIInstance.post(`${baseURL}/`, user)
}

const getById = (id) => {
  return DefaultAPIInstance.get(`${baseURL}/${id}`)
}

const update = (id, payloads) => {
  return DefaultAPIInstance.put(`${baseURL}/${id}`, payloads)
}

const _delete = (id) => {
  return DefaultAPIInstance.delete(`${baseURL}/${id}`)
}

export const accountService = {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getAll,
  create,
  getById,
  update,
  delete: _delete
};
