import {config} from '../../config';
import {DefaultAPIInstance} from "@/helpers/axios-instances";
import { tokenExpirationTime } from "@/helpers/authorization";

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
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/accounts`, requestOptions).then(handleResponse);
}

const getById = (id) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/accounts/${id}`, requestOptions).then(handleResponse);
}

const update = (user) => {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/accounts/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
const _delete = (id) => {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/accounts/${id}`, requestOptions).then(handleResponse);
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
};
