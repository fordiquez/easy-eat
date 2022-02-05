const Joi = require('joi');
const validateRequest = require('middlewares/validate-request');
const Role = require('helpers/role.helper');
const accountService = require('../services/accounts.service');
const productService = require('../services/products.service');

const getAll = (req, res, next) => {
  accountService.getAll().then(accounts => res.json(accounts)).catch(next);
}

const getById = (req, res, next) => {
  console.log(req.headers.authorization)
  // users can get their own account and admins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  accountService.getById(req.params.id).then(account => account ? res.json(account) : res.sendStatus(404)).catch(next);
}

const createSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid(Role.Admin, Role.User).required()
  });
  validateRequest(req, next, schema);
}

const create = (req, res, next) => {
  productService.create(req.body).then(account => res.json(account)).catch(next);
}

const updateSchema = (req, res, next) => {
  const schemaRules = {
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).empty('')
  };

  // only admins can update role
  if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
  }

  const schema = Joi.object(schemaRules).with('password', 'passwordConfirm');
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  // users can update their own account and admins can update any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  accountService.update(req.params.id, req.body)
    .then(account => res.json(account))
    .catch(next);
}

const _delete = (req, res, next) => {
  // users can delete their own account and admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  accountService.delete(req.params.id)
    .then(account => res.json(account))
    .catch(next);
}

module.exports = {
  getAll,
  getById,
  create,
  createSchema,
  update,
  updateSchema,
  _delete
}
