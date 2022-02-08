import axios from "axios";
import { getCookie, getToken, isTokenExpired, tokenExpirationTime } from "@/utils/storage";
import store from '@/store/index'

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
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
}

export const DefaultAPIInstance = axios.create(defaultConfig)

DefaultAPIInstance.interceptors.request.use(async (config) => {
  const token = getToken()
  const cookie = getCookie('refreshToken')
  token?.token && token?.expires && cookie ? config.headers['Authorization'] = `Bearer ${token.token}` : null
  if (cookie && token?.token && token?.expires && isTokenExpired(token?.expires)) {
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
