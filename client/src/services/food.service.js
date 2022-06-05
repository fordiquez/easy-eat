import { DefaultAPI, FoodDatabaseAPI } from "@/utils/axios";
import qs from "qs";

const baseURL = '/foods'

const searchParser = async (params) => {
  return await FoodDatabaseAPI.get('/api/food-database/v2/parser', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })
}

const searchNextPage = async (nextUrl) => {
  return await FoodDatabaseAPI.get(nextUrl)
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
  searchParser,
  searchNextPage,
  add,
  get,
  update,
  delete: _delete
}
