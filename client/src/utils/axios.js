import axios from "axios";
import { getCookie, getToken, isTokenExpired, tokenExpirationTime } from "@/utils/authorization";
import store from '@/store/index'

axios.defaults.withCredentials = true

const rapidConfig = {
  baseURL: process.env.VUE_APP_RAPID_API_NUTRITION_ANALYSIS_URL,
  headers: {
    'x-rapidapi-host': process.env.VUE_APP_RAPID_API_HOST,
    'x-rapidapi-key': process.env.VUE_APP_RAPID_API_KEY
  }
}

export const RapidAPIInstance = axios.create(rapidConfig)

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
      const expires = tokenExpirationTime(response.data)
      const jwtToken = {
        token: response.data.jwtToken,
        expires
      }
      store.commit('account/SET_USER', response.data)
      store.commit('account/SET_TOKEN', jwtToken)
      config.headers['Authorization'] = `Bearer ${response.data.jwtToken}`
    }).catch(error => {
      return Promise.reject(error)
    })
  }
  return config
}, error => {
  return Promise.reject(error);
})
