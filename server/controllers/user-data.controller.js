const Joi = require("joi");
const Role = require("helpers/role.helper");
const userDataService = require("services/user-data.service");
const validateRequest = require("middlewares/validate-request");

const getAll = (req, res, next) => {
  userDataService.getAll().then(accounts => res.json(accounts)).catch(next);
}

const getById = (req, res, next) => {
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  console.log(req.params)
  userDataService.getById(req.params.id).then(doc => doc ? res.json(doc) : res.sendStatus(404)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    accountId: Joi.string().required(),
    currentWeight: Joi.number().required(),
    goalWeight: Joi.number().required(),
    height: Joi.number().required(),
    sex: Joi.string().required(),
    birthdayDate: Joi.date().required(),
    activityLevel: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  userDataService.create(req.body).then(doc => res.json(doc)).catch(next);
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
  // users can update their own account and admins can update any account
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  userDataService.update(req.params.id, req.body).then(doc => res.json(doc)).catch(next);
}

const _delete = (req, res, next) => {
  // users can delete their own account and admins can delete any account
  // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  userDataService.delete(req.params.id).then(doc => res.json(doc)).catch(next);
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