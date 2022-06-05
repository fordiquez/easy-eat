const db = require('helpers/db.helper')

const create = async (params) => {
  const { id } = await db.Account.findById(params.accountId);
  const food = new db.Food({
    accountId: id,
    date: params.date,
    mealTime: params.mealTime,
    measure: params.measure,
    servings: params.servings,
    label: params.label,
    category: params.category,
    foodContentsLabel: params.foodContentsLabel,
    image: params.image,
    nutrients: params.nutrients
  })
  await food.save()
  return {
    food,
    message: `Added ${params.label} to ${params.mealTime}`
  }
}

const get = async ({ accountId }) => {
  return db.Food.find({ accountId })
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
