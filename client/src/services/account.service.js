import { DefaultAPI } from "@/utils/axios";
import { tokenExpirationTime } from "@/utils/storage";

const baseURL = '/accounts'

const login = async (email, password) => {
  return await DefaultAPI.post(`${baseURL}/authenticate`, { email, password }).then(response => {
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

const logout = async () => {
  return await DefaultAPI.post(`${baseURL}/revoke-token`, {})
}

const refreshToken = async () => {
  return await DefaultAPI.post(`${baseURL}/refresh-token`, {}).then(response => {
    tokenExpirationTime(response.data)
    return response
  }).catch(error => {
    return Promise.reject(error)
  })
}

const register = async user => {
  return await DefaultAPI.post(`${baseURL}/register`, user)
}

const verifyEmail = async token => {
  return await DefaultAPI.post(`${baseURL}/verify-email`, { token })
}

const forgotPassword = async email => {
  return await DefaultAPI.post(`${baseURL}/forgot-password`, { email })
}

const validateResetToken = async token => {
  return await DefaultAPI.post(`${baseURL}/validate-reset-token`, { token })
}

const resetPassword = async (token, password, passwordConfirm) => {
  return await DefaultAPI.post(`${baseURL}/reset-password`, { token, password, passwordConfirm })
}

const getAll = async () => {
  return await DefaultAPI.get(`${baseURL}/`)
}

const create = async user => {
  return await DefaultAPI.post(`${baseURL}/`, user)
}

const getById = async id => {
  return await DefaultAPI.get(`${baseURL}/${id}`)
}

const update = async (id, payload) => {
  return await DefaultAPI.put(`${baseURL}/${id}`, payload)
}

const _delete = async id => {
  return await DefaultAPI.delete(`${baseURL}/${id}`)
}

const uploadAvatar = async (file, id, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return await DefaultAPI.post(`${baseURL}/upload/${id}`, formData, {
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
