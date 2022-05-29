const Joi = require('joi');
const foodsService = require('services/foods.service');
const validateRequest = require('middlewares/validate-request');

const get = (req, res, next) => {
  foodsService.get(req.query).then(food => res.json(food)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    date: Joi.date().required(),
    mealTime: Joi.string().required(),
    measure: Joi.string().required(),
    servings: Joi.number().required(),
    foodId: Joi.string().required(),
    label: Joi.string().required(),
    category: Joi.string().required(),
    categoryLabel: Joi.string().required(),
    nutrients: Joi.object().required(),
    image: Joi.string(),
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  foodsService.create(req.body).then(food => res.json(food)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    account: Joi.string().required(),
    date: Joi.date().required(),
    mealTime: Joi.string().required(),
    measure: Joi.string().required(),
    servings: Joi.number().required(),
    foodId: Joi.string().required(),
    label: Joi.string().required(),
    category: Joi.string().required(),
    categoryLabel: Joi.string().required(),
    nutrients: Joi.object().required(),
    image: Joi.string(),
  });
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  foodsService.update(req.params.id, req.body).then(food => res.json(food)).catch(next);
}

const _delete = (req, res, next) => {
  foodsService.delete(req.params.id).then(food => res.json(food)).catch(next);
}

module.exports = {
  get,
  create,
  createSchema,
  update,
  updateSchema,
  delete: _delete
}
