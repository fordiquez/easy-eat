const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('helpers/email.helper');
const db = require('helpers/db.helper');
const Role = require('helpers/role.helper');

const register = async (params, origin) => {
  if (await db.Account.findOne({ email: params.email })) {
    await sendAlreadyRegisteredEmail(params.email, origin);
    throw 'Account with such email has already been registered'
  }
  const account = new db.Account(params);

  const isFirstAccount = (await db.Account.countDocuments({})) === 0;
  account.role = isFirstAccount ? Role.Admin : Role.User;
  account.isVerified = false;
  account.verificationToken = randomTokenString();
  account.passwordHash = hash(params.password);

  await account.save();

  await sendVerificationEmail(account, origin);
  const messages = {
    success: `Congratulations, ${params.firstName}! Your account has been successfully registered`,
    info: `Please check your email ${params.email} to verify the account`
  }
  return {
    messages,
    user: {
      ...basicDetails(account)
    }
  }
}

const verifyEmail = async ({ token }) => {
  const account = await db.Account.findOne({ verificationToken: token });

  if (!account) throw 'Verification failed. Account with such token has not found';
  if (account.verified) throw 'Account has already been verified';

  account.isVerified = false;
  account.verified = Date.now();
  // account.verificationToken = undefined;
  await account.save();
  return {
    message: 'Verification was successful, you can now log in into your account'
  }
}

const forgotPassword = async ({ email }, origin) => {
  const account = await db.Account.findOne({ email });

  if (!account) throw 'Account with such email has not found';

  // reset token expires after 24 hours
  account.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
  await account.save();

  // send email
  await sendPasswordResetEmail(account, origin);

  return {
    message: 'Please check your email for password reset instructions'
  }
}

const validateResetToken = async ({ token }) => {
  const account = await db.Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() }
  });

  if (!account) throw 'Invalid token';

  return {
    message: 'The reset token has been confirmed, you can now come up with a new password for your account'
  }
}

const resetPassword = async ({ token, password }) => {
  const account = await db.Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() }
  });

  if (!account) throw 'Invalid token';

  account.passwordHash = hash(password);
  account.passwordReset = Date.now();
  account.resetToken = undefined;
  await account.save();
  return {
    message: 'Password reset successfully, you can now log in into your account'
  }
}

const authenticate = async ({ email, password, ipAddress }) => {
  const account = await db.Account.findOne({ email });

  if (!account) throw 'Account has not been found'
  else if (!bcrypt.compareSync(password, account.passwordHash)) throw 'Email or password is incorrect'
  else if (!account.isVerified) throw 'Account has not been verified';

  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);
  await refreshToken.save();
  const message = 'You have successfully logged in'

  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token,
    message
  };
}

const refreshToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);
  const { account } = refreshToken;

  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  const jwtToken = generateJwtToken(account);

  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

const revokeToken = async (token) => {
  const refreshToken = await getRefreshToken(token);
  await refreshToken.remove();
  return {
    message: 'Your session has ended successfully'
  }
}

const getAll = async () => {
  const accounts = await db.Account.find();
  return accounts.map(x => basicDetails(x));
}

const getById = async (id) => {
  const account = await getAccount(id);
  return basicDetails(account);
}

const create = async (params) => {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const account = new db.Account(params);
  account.verified = Date.now();

  // hash password
  account.passwordHash = hash(params.password);

  // save account
  await account.save();

  return {
    ...basicDetails(account),
    message: 'The user account has been successfully created'
  };
}

const update = async (id, params) => {
  const account = await getAccount(id)
  let message = 'The user account updated successfully'
  // validate (if email was changed)
  if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }
  message = 'Email address updated successfully'

  if (params.password) {
    if (!bcrypt.compareSync(params.password, account.passwordHash)) throw 'Unfortunately, your current password is incorrect'
    if (params.updatedPassword && params.updatedPasswordConfirm) {
      // hash password if it was changed
      params.passwordHash = hash(params.updatedPassword)
      message = 'Password updated successfully'
    }
  }
  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return {
    ...basicDetails(account),
    message
  };
}

const _delete = async (id) => {
  const account = await getAccount(id)
  await db.MealPlan.findByIdAndDelete(id)
  await db.RefreshToken.deleteMany({ account: id })
  await account.remove()

  return {
    message: 'The user account has been successfully deleted'
  }
}

const uploadAvatar = async (req) => {
  const account = await getAccount(req.params.id)
  if (account.avatar.id && account.avatar.filename) await db.deleteAvatar(account.avatar.id)
  account.avatar = {
    id: req.file.id,
    filename: req.file.filename
  }
  await account.save()
  return {
    avatar: req.file,
    message: 'Avatar has been downloaded successfully'
  }
}

const getAvatar = async (req, res) => {
  const { avatar } = await getAccount(req.params.id)
  return avatar.id && avatar.filename ? db.getAvatar(avatar.filename, res) : res.json({ message: 'Avatar not found' })
}

const updatedAvatar = async (req, res) => {
  const filename = req.params.filename
  return filename ? db.getAvatar(filename, res) : res.json({ message: 'Avatar not found' })
}

const deleteAvatar = async (req) => {
  const account = await getAccount(req.params.id)
  if (!account.avatar.id || !account.avatar.filename) {
    return {
      message: 'Avatar not found'
    }
  }
  await db.deleteAvatar(account.avatar.id)
  account.avatar = {}
  await account.save()
  return {
    message: 'Avatar has been deleted successfully'
  }
}

// helper functions

const randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}

const hash = (password) => {
  return bcrypt.hashSync(password, 10);
}

const getAccount = async (id) => {
  if (!db.isValidId(id)) throw 'Account not found';
  const account = await db.Account.findById(id);
  if (!account) throw 'Account not found';
  return account;
}

const getRefreshToken = async (token) => {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
  return refreshToken;
}

const generateJwtToken = (account) => {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({ sub: account.id, id: account.id }, process.env.SECRET, { expiresIn: '1h' });
}

const generateRefreshToken = (account, ipAddress) => {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    account: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
}

const basicDetails = (account) => {
  const { id, email, firstName, lastName, role, verified, created, updated, avatar } = account;
  return { id, email, firstName, lastName, role, verified, created, updated, avatar };
}

// email functions

const sendVerificationEmail = async (account, origin) => {
  let message;
  if (origin) {
    const verifyUrl = `${origin}/auth/verify-email?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'EasyEat — Verify Email',
    html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
  });
}

const sendAlreadyRegisteredEmail = async (email, origin) => {
  let message;
  if (origin) {
    message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgot-password">forgot password</a> page.</p>`;
  } else {
    message = `<p>If you don't know your password you can reset it via the <code>/accounts/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
    to: email,
    subject: 'EasyEat — Email Already Registered',
    html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
  });
}

const sendPasswordResetEmail = async (account, origin) => {
  let message;
  if (origin) {
    const resetUrl = `${origin}/auth/reset-password?token=${account.resetToken.token}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'EasyEat — Reset Password',
    html: `<h4>Reset Password Email</h4>
               ${message}`
  });
}

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  uploadAvatar,
  getAvatar,
  updatedAvatar,
  deleteAvatar
};
