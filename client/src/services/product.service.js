import { RapidAPIInstance } from "@/utils/axios";

const search = async (options) => {
  return await RapidAPIInstance.get('/api/nutrition-data', options)
}

export const productService = {
  search
}
