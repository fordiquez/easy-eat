const Joi = require('joi');
const validateRequest = require('middlewares/validate-request');
const Role = require('utils/role');
const accountService = require('services/accounts.service');

const registerSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
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
    .then(({ refreshToken, ...account }) => setTokenCookie(res, refreshToken).then(() => res.json(account))).catch(next);
}

const refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  accountService.refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...account }) => setTokenCookie(res, refreshToken).then(() => res.json(account))).catch(next);
}

const revokeTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().empty('')
  });
  validateRequest(req, next, schema);
}

const revokeToken = (req, res, next) => {
  const token = req.cookies.refreshToken
  if (!token) return res.status(400).json({ message: 'Token is required' });

  if (!req.auth.ownsToken(token) && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  accountService.revokeToken(token).then(response => res.json(response)).catch(next);
}

const getAll = (req, res, next) => {
  accountService.getAll().then(accounts => res.json(accounts)).catch(next);
}

const getById = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
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
    password: Joi.string().empty(''),
    updatedPassword: Joi.string().min(6).empty(''),
    updatedPasswordConfirm: Joi.string().valid(Joi.ref('updatedPassword')).empty('')
  };

  if (req.auth.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
  }

  const schema = Joi.object(schemaRules).with('updatedPassword', 'updatedPasswordConfirm');
  validateRequest(req, next, schema);
}

const update = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  accountService.update(req.params.id, req.body).then(account => res.json(account)).catch(next);
}

const _delete = (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  accountService.delete(req.params.id).then(account => res.json(account)).catch(next);
}

const uploadAvatar = async (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  await accountService.uploadAvatar(req.params.id, req.file).then(avatar => res.json(avatar)).catch(next)
}

const getAvatar = async (req, res, next) => {
  await accountService.getAvatar(req.params.id, res).then(avatar => avatar).catch(next)
}

const updatedAvatar = async (req, res, next) => {
  await accountService.updatedAvatar(req.params.filename, res).then(avatar => avatar).catch(next)
}

const deleteAvatar = async (req, res, next) => {
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  await accountService.deleteAvatar(req.params.id).then(avatar => res.json(avatar)).catch(next)
}

// helper functions

const setTokenCookie = async (res, token) => {
  // cookie refresh token expires in 7 days
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
  delete: _delete,
  uploadAvatar,
  getAvatar,
  updatedAvatar,
  deleteAvatar,
}
