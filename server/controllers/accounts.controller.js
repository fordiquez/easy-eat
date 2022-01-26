const Joi = require('joi');
const validateRequest = require('middlewares/validate-request');
const Role = require('helpers/role.helper');
const accountService = require('../services/accounts.service');

const registerSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
    acceptTerms: Joi.boolean().valid(true).required()
  });
  validateRequest(req, next, schema);
}

const register = (req, res, next) => {
  accountService.register(req.body, req.get('origin')).then(response => res.json(response)).catch(next);
}

const verifyEmailSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

const verifyEmail = (req, res, next) => {
  accountService.verifyEmail(req.body).then(response => res.json(response)).catch(next);
}

const forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });
  validateRequest(req, next, schema);
}

const forgotPassword = (req, res, next) => {
  accountService.forgotPassword(req.body, req.get('origin')).then(response => res.json(response)).catch(next);
}

const validateResetTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

const validateResetToken = (req, res, next) => {
  accountService.validateResetToken(req.body).then(response => res.json(response)).catch(next);
}

const resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

const resetPassword = (req, res, next) => {
  accountService.resetPassword(req.body).then(response => res.json(response)).catch(next);
}

const authenticateSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

const authenticate = (req, res, next) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  accountService.authenticate({ email, password, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

const refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  console.log(req.cookies)
  const ipAddress = req.ip;
  accountService.refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...account }) => {
      setTokenCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

const revokeTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().empty('')
  });
  validateRequest(req, next, schema);
}

const revokeToken = (req, res, next) => {
  // accept token from request body or cookie
  // const token = req.cookies.refreshToken || req.headers.authorization;
  const token = req.cookies.refreshToken
  console.log(req.headers)
  console.log(req.cookies)
  const ipAddress = req.ip;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  accountService.revokeToken({ token, ipAddress }).then(response => res.json(response)).catch(next);
}

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
  accountService.create(req.body).then(account => res.json(account)).catch(next);
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
    .then(() => res.json({ message: 'Account deleted successfully' }))
    .catch(next);
}

// helper functions

const setTokenCookie = async (res, token) => {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  res.cookie('refreshToken', token, cookieOptions);
}

module.exports = {
  authenticateSchema,
  authenticate,
  refreshToken,
  revokeTokenSchema,
  revokeToken,
  registerSchema,
  register,
  verifyEmailSchema,
  verifyEmail,
  forgotPassword,
  forgotPasswordSchema,
  validateResetTokenSchema,
  validateResetToken,
  resetPassword,
  resetPasswordSchema,
  getAll,
  getById,
  create,
  createSchema,
  update,
  updateSchema,
  _delete
}
