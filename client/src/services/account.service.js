import { DefaultAPI } from "@/utils/axios";
import { tokenExpirationTime } from "@/utils/storage";

const baseURL = '/accounts'

const login = (email, password) => {
  return DefaultAPI.post(`${baseURL}/authenticate`, { email, password }).then(response => {
    DefaultAPI.interceptors.request.use(config => {
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
  return DefaultAPI.post(`${baseURL}/revoke-token`, {})
}

const refreshToken = () => {
  return DefaultAPI.post(`${baseURL}/refresh-token`, {}).then(response => {
    tokenExpirationTime(response.data)
    return response
  }).catch(error => {
    return Promise.reject(error)
  })
}

const register = user => {
  return DefaultAPI.post(`${baseURL}/register`, user)
}

const verifyEmail = token => {
  return DefaultAPI.post(`${baseURL}/verify-email`, { token })
}

const forgotPassword = email => {
  return DefaultAPI.post(`${baseURL}/forgot-password`, { email })
}

const validateResetToken = token => {
  return DefaultAPI.post(`${baseURL}/validate-reset-token`, { token })
}

const resetPassword = (token, password, passwordConfirm) => {
  return DefaultAPI.post(`${baseURL}/reset-password`, { token, password, passwordConfirm })
}

const getAll = () => {
  return DefaultAPI.get(`${baseURL}/`)
}

const create = user => {
  return DefaultAPI.post(`${baseURL}/`, user)
}

const getById = id => {
  return DefaultAPI.get(`${baseURL}/${id}`)
}

const update = (id, payload) => {
  return DefaultAPI.put(`${baseURL}/${id}`, payload)
}

const _delete = id => {
  return DefaultAPI.delete(`${baseURL}/${id}`)
}

const uploadAvatar = (file, id, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return DefaultAPI.post(`${baseURL}/upload/${id}`, formData, {
    onUploadProgress
  })
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
  delete: _delete,
  uploadAvatar
};
