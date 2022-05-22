import { DefaultAPI } from "@/utils/axios";

const baseURL = '/user-data'

const create = async (payload) => {
  return await DefaultAPI.post(`${baseURL}/`, payload)
}

const getById = async (id) => {
  return await DefaultAPI.get(`${baseURL}/${id}`)
}

const edit = async (payload) => {
  return await DefaultAPI.put(`${baseURL}/${payload.id}`, payload)
}

const _delete = async (id) => {
  return await DefaultAPI.delete(`${baseURL}/${id}`)
}

export const userDataService = {
  create,
  getById,
  edit,
  delete: _delete
}
