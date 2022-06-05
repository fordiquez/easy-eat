const Joi = require("joi");
const Role = require("helpers/role.helper");
const userDataService = require("services/user-data.service");
const validateRequest = require("middlewares/validate-request");

const getAll = (req, res, next) => {
  userDataService.getAll().then(userData => res.json(userData)).catch(next);
}

const getById = (req, res, next) => {
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  userDataService.getById(req.params.id).then(userData => userData ? res.json(userData) : res.sendStatus(404)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required(),
    currentWeight: Joi.number(),
    goalWeight: Joi.number(),
    height: Joi.number(),
    sex: Joi.string(),
    birthdayDate: Joi.date(),
    activityLevel: Joi.string()
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  userDataService.create(req.body).then(userData => res.json(userData)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required(),
    currentWeight: Joi.number(),
    goalWeight: Joi.number(),
    height: Joi.number(),
    sex: Joi.string(),
    birthdayDate: Joi.date(),
    activityLevel: Joi.string(),
    caloriesGoal: Joi.string(),
    BMR: Joi.number(),
    TDEE: Joi.number(),
    macros: Joi.object(),
    selectedPlan: Joi.string(),
    customProportions: Joi.object()
  });
  validateRequest(req, next, schema);
}

const update = async (req, res, next) => {
  // users can update their own account and admins can update any account
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  userDataService.update(req.params.id, req.body).then(userData => res.json(userData)).catch(next);
}

const _delete = (req, res, next) => {
  // users can delete their own account and admins can delete any account
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  userDataService.delete(req.params.id).then(userData => res.json(userData)).catch(next);
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