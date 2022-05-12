const Joi = require('joi');
const validateRequest = require('middlewares/validate-request');
const Role = require('helpers/role.helper');
const accountService = require('../services/accounts.service');
const foodsService = require('../services/foods.service');

const get = (req, res, next) => {
  foodsService.get(req.query).then(products => res.json(products)).catch(next);
}

// const getById = (req, res, next) => {
//   console.log(req.headers.authorization)
//   // users can get their own account and admins can get any account
//   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   accountService.getById(req.params.id).then(account => account ? res.json(account) : res.sendStatus(404)).catch(next);
// }

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
  foodsService.create(req.body).then(account => res.json(account)).catch(next);
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
  foodsService.delete(req.params.id).then(account => res.json(account)).catch(next);
}

module.exports = {
  get,
  create,
  createSchema,
  update,
  updateSchema,
  _delete
}
