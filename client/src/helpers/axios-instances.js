import axios from "axios";
import { getCookie, getToken, isTokenExpired } from "@/helpers/authorization";

axios.defaults.withCredentials = true

const authConfig = {
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const AuthAPIInstance = axios.create(authConfig)

const defaultConfig = {
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
}

export const DefaultAPIInstance = axios.create(defaultConfig)

DefaultAPIInstance.interceptors.request.use(async (config) => {
  const { token, expires } = getToken()
  token ? config.headers['Authorization'] = `Bearer ${token}` : null
  const cookie = getCookie('refreshToken')
  if (cookie && token && expires && isTokenExpired(expires)) {
    const refreshInstance = axios.create(defaultConfig)
    await refreshInstance.post('/accounts/refresh-token').then(response => {
      config.headers['Authorization'] = `Bearer ${response.data.jwtToken}`
    }).catch(error => {
      return Promise.reject(error)
    })
  }
  return config
}, error => {
  return Promise.reject(error);
})
