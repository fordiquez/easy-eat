import axios from "axios";
import {getCookie, getToken, isTokenExpired, tokenExpirationTime} from "@/utils/storage";
import store from '@/store/index'

const nutritionAnalysisConfig = {
  baseURL: process.env.VUE_APP_API_NUTRITION_ANALYSIS_URL,
  headers: {
    'x-rapidapi-host': process.env.VUE_APP_API_NUTRITION_ANALYSIS_HOST,
    'x-rapidapi-key': process.env.VUE_APP_RAPID_API_KEY
  }
}

export const NutritionAnalysisAPI = axios.create(nutritionAnalysisConfig)

const nutritionInfoConfig = {
  baseURL: process.env.VUE_APP_API_FOOD_DATABASE_URL,
  headers: {
    'x-rapidapi-host': process.env.VUE_APP_API_FOOD_DATABASE_HOST,
    'x-rapidapi-key': process.env.VUE_APP_RAPID_API_KEY
  }
}

export const NutritionInfoAPI = axios.create(nutritionInfoConfig)

const defaultConfig = {
  baseURL: process.env.VUE_APP_BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Private-Network': true
  }
}

export const DefaultAPI = axios.create(defaultConfig)

DefaultAPI.interceptors.request.use(async (config) => {
  const token = getToken()
  const cookie = getCookie('refreshToken')
  token ? config.headers.Authorization = `Bearer ${token.token}` : delete config.headers.Authorization
  if (cookie && token && isTokenExpired(token?.expires)) {
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
    }).catch(async error => {
      console.log(error.response)
      await store.commit('account/LOGOUT_USER')
      await this.$router.push({ name: 'Login' })
      await store.dispatch('notification/setSnackbar', { type: 'error', text: error.response })
    })
  }
  return config
}, error => {
  return Promise.reject(error);
})
