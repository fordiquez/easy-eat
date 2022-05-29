const db = require("helpers/db.helper");

const getAll = async () => await db.MealPlan.find()

const getById = async (id) => await getMealPlan(id)

const create = async (params) => {
  const existedMealPlan = await db.MealPlan.findOne({ title: params.title })
  if (existedMealPlan) throw 'Meal plan with such title already exists'
  const mealPlan = new db.MealPlan(params)
  await mealPlan.save()
  return {
    mealPlan,
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
    message: 'The meal plan has been successfully updated'
  }
}

const _delete = async (id) => {
  const mealPlan = await getMealPlan(id)
  await mealPlan.remove()

  return {
    message: 'The meal plan has been successfully deleted'
  }
}

const getMealPlan = async (id) => {
  if (!db.isValidId(id)) throw 'Meal plan not found'
  const mealPlan = await db.MealPlan.findById(id)
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