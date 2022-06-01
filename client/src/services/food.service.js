import { DefaultAPI, NutritionAnalysisAPI, NutritionInfoAPI } from "@/utils/axios";

const baseURL = '/foods'

const nutritionAnalysis = async (options) => {
  return await NutritionAnalysisAPI.get('/api/nutrition-data', options)
}

const search = async (options) => {
  return await NutritionInfoAPI.get('/parser', options)
}

const add = async (payload) => {
  return await DefaultAPI.post(`${baseURL}/`, payload)
}

const get = async (params) => {
  return await DefaultAPI.get(`${baseURL}/`, { params })
}

const update = async (payload) => {
  return await DefaultAPI.put(`${baseURL}/${payload.id}`, payload)
}

const _delete = async (id) => {
  return await DefaultAPI.delete(`${baseURL}/${id}`)
}

export const foodService = {
  nutritionAnalysis,
  search,
  add,
  get,
  update,
  delete: _delete
}
