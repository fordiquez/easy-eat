const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('helpers/email.helper');
const db = require('helpers/db.helper');
const Role = require('helpers/role.helper');

const register = async (params, origin) => {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    // send already registered error in email to prevent account enumeration
    // await sendAlreadyRegisteredEmail(params.email, origin);
    throw 'Account with such email has already been registered'
  }

  // create account object
  const account = new db.Account(params);
  // first registered account is an admin
  const isFirstAccount = (await db.Account.countDocuments({})) === 0;
  account.role = isFirstAccount ? Role.Admin : Role.User;
  account.isVerified = false;
  account.verificationToken = randomTokenString();

  // hash password
  account.passwordHash = hash(params.password);

  // save account
  await account.save();

  // send email
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

  // always return ok response to prevent email enumeration
  if (!account) throw 'Account with such email has not found';

  // create reset token that expires after 24 hours
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

  // update password and remove reset token
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

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token
  };
}

const refreshToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);
  const { account } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

const revokeToken = async (token) => {
  const refreshToken = await getRefreshToken(token);
  console.log(refreshToken)
  // remove token from the collection
  await refreshToken.remove();
  return {
    message: 'Token revoked'
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
  const account = await getAccount(id);

  // validate (if email was changed)
  if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return {
    ...basicDetails(account),
    message: 'The user account has been successfully updated'
  };
}

const _delete = async (id) => {
  const account = await getAccount(id);
  await db.RefreshToken.deleteMany({ account: id })
  await account.remove();

  return {
    message: 'The user account has been successfully deleted'
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
  return jwt.sign({ sub: account.id, id: account.id }, process.env.SECRET, { expiresIn: '15m' });
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
  const { id, title, firstName, lastName, email, role, created, updated, isVerified } = account;
  return { id, title, firstName, lastName, email, role, created, updated, isVerified };
}

// email functions

const sendVerificationEmail = async (account, origin) => {
  let message;
  if (origin) {
    const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'Sign-up Verification API - Verify Email',
    html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
  });
}

const sendAlreadyRegisteredEmail = async (email, origin) => {
  let message;
  if (origin) {
    message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
  } else {
    message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
    to: email,
    subject: 'Sign-up Verification API - Email Already Registered',
    html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
  });
}

const sendPasswordResetEmail = async (account, origin) => {
  let message;
  if (origin) {
    const resetUrl = `${origin}/account/reset-password?token=${account.resetToken.token}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'Sign-up Verification API - Reset Password',
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
  delete: _delete
};
