const db = require('helpers/db.helper')

const create = async (params) => {
  const { id } = await db.Account.findById(params.userId);
  const food = new db.Food({
    account: id,
    date: params.date,
    mealTime: params.mealTime,
    measure: params.measure,
    servings: params.servings,
    foodId: params.foodId,
    label: params.label,
    category: params.category,
    categoryLabel: params.categoryLabel,
    nutrients: params.nutrients,
    image: params.image
  })
  await food.save()
  return {
    food,
    message: `Added ${params.label} to ${params.mealTime}`
  }
}

const get = async ({ account }) => {
  return db.Food.find({ account })
}

const update = async (id, params) => {
  const food = await db.Food.findById(id);

  Object.assign(food, params);
  food.updated = Date.now();
  await food.save();

  return {
    food,
    message: `Updated ${food.label} for ${food.mealTime}`
  }
}

const _delete = async (id) => {
  const food = await db.Food.findById(id);
  await food.remove();
  return {
    message: `Removed ${food.label} from ${food.mealTime}`
  }
}

module.exports = {
  create,
  get,
  update,
  delete: _delete
}
