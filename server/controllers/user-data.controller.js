const Joi = require("joi");
const Role = require("utils/role");
const userDataService = require("services/user-data.service");
const validateRequest = require("middlewares/validate-request");

const getAll = (req, res, next) => {
  userDataService.getAll().then(userData => res.json(userData)).catch(next);
}

const getById = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Denied access' });
  }
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
  if (req.body.accountId !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Denied access' });
  }
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
    macros: Joi.object({
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
    selectedPlan: Joi.string(),
    customProportions: Joi.object({
      CARBS: Joi.number().required(),
      PROTEIN: Joi.number().required(),
      FAT: Joi.number().required()
    }),
  });
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Denied access' });
  }
  userDataService.update(req.params.id, req.body).then(userData => res.json(userData)).catch(next);
}

const _delete = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Denied access' });
  }
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