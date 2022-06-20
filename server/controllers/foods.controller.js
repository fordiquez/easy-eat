const Joi = require('joi');
const foodsService = require('services/foods.service');
const validateRequest = require('middlewares/validate-request');

const get = (req, res, next) => {
  if (req.query.accountId !== req.auth.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  foodsService.get(req.query).then(food => res.json(food)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required(),
    date: Joi.date().required(),
    mealTime: Joi.string().required(),
    measure: Joi.string().required(),
    servings: Joi.number().required().min(1),
    label: Joi.string().required(),
    category: Joi.string().required(),
    healthLabels: Joi.array().items(Joi.string()),
    image: Joi.string(),
    nutrients: Joi.object({
      CALS: Joi.number().required(),
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  if (req.body.accountId !== req.auth.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  foodsService.create(req.body).then(food => res.json(food)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    accountId: Joi.string().required(),
    date: Joi.date().required(),
    mealTime: Joi.string().required(),
    measure: Joi.string().required(),
    servings: Joi.number().required(),
    label: Joi.string().required(),
    category: Joi.string().required(),
    healthLabels: Joi.array().items(Joi.string()),
    image: Joi.string(),
    nutrients: Joi.object({
      CALS: Joi.number().required(),
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
  });
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  if (req.body.accountId !== req.auth.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  foodsService.update(req.params.id, req.body).then(food => res.json(food)).catch(next);
}

const _delete = (req, res, next) => {
  if (req.query.accountId !== req.auth.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  foodsService.delete(req.params.id).then(food => res.json(food)).catch(next);
}

const bulkDelete = (req, res, next) => {
  if (req.query.accountId !== req.auth.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  foodsService.bulkDelete(req.query.accountId).then(food => res.json(food)).catch(next);
}

module.exports = {
  get,
  create,
  createSchema,
  update,
  updateSchema,
  delete: _delete,
  bulkDelete
}
