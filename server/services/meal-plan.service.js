const db = require("helpers/db.helper");

const getAll = async () => await db.MealPlan.find()

const getById = async (id) => await getMealPlan(id)

const create = async (params) => {
  const existedMealPlan = await db.MealPlan.findOne({ accountId: params.accountId })
  if (existedMealPlan) {
    console.log(existedMealPlan)
    existedMealPlan.remove()
  }
  const newUserData = new db.MealPlan(params)
  await newUserData.save()
  return {
    newUserData,
    message: 'The meal plan has been successfully created'
  }
}

const update = async (id, params) => {
  const mealPlan = await getMealPlan(id)
  Object.assign(mealPlan, params)
  mealPlan.updated = Date.now()
  await mealPlan.save()

  return {
    mealPlan,
    message: 'The user data has been successfully updated'
  }
}

const _delete = async (id) => {
  const mealPlan = await getMealPlan(id)
  await mealPlan.remove()

  return {
    message: 'The user data has been successfully deleted'
  }
}

const getMealPlan = async (accountId) => {
  if (!db.isValidId(accountId)) throw 'Meal plan not found'
  const mealPlan = await db.MealPlan.findOne({ accountId })
  if (!mealPlan) throw 'Meal plan not found'
  return mealPlan
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}