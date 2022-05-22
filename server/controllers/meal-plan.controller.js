const Joi = require("joi");
const mealPlanService = require("services/meal-plan.service");
const validateRequest = require("middlewares/validate-request");

const getAll = (req, res, next) => {
  mealPlanService.getAll().then(accounts => res.json(accounts)).catch(next);
}

const getById = (req, res, next) => {
  console.log(req.params)
  mealPlanService.getById(req.params.id).then(doc => doc ? res.json(doc) : res.sendStatus(404)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required(),
    mealGoal: Joi.string().required(),
    BMR: Joi.number().required(),
    TDEE: Joi.number().required(),
    macros: Joi.object().required(),
    selectedDiet: Joi.object().required()
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  mealPlanService.create(req.body).then(doc => res.json(doc)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schema = {
    account: Joi.required(),
    sex: Joi.string(),
    birthday_date: Joi.date(),
    height: Joi.number(),
    weight: Joi.number(),
  };
  validateRequest(req, next, schema);
}

const update = async (req, res, next) => {
  mealPlanService.update(req.params.id, req.body).then(doc => res.json(doc)).catch(next);
}

const _delete = (req, res, next) => {
  mealPlanService.delete(req.params.id).then(doc => res.json(doc)).catch(next);
}

module.exports = {
  getAll,
  getById,
  createSchema,
  create,
  updateSchema,
  update,
  delete: _delete
}