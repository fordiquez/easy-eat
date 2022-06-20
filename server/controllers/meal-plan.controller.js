const Joi = require("joi");
const mealPlanService = require("services/meal-plan.service");
const validateRequest = require("middlewares/validate-request");

const getAll = (req, res, next) => {
  mealPlanService.getAll().then(mealPlans => res.json(mealPlans)).catch(next);
}

const getById = (req, res, next) => {
  mealPlanService.getById(req.params.id).then(mealPlan => mealPlan ? res.json(mealPlan) : res.sendStatus(404)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    proportions: Joi.object({
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  mealPlanService.create(req.body).then(mealPlan => res.json(mealPlan)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    proportions: Joi.object({
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
  });
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  mealPlanService.update(req.params.id, req.body).then(mealPlan => res.json(mealPlan)).catch(next);
}

const _delete = (req, res, next) => {
  mealPlanService.delete(req.params.id).then(mealPlan => res.json(mealPlan)).catch(next);
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