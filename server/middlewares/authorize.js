const { expressjwt } = require('express-jwt');
const db = require('utils/db');

module.exports = authorize;

function authorize(roles = []) {
  const secret = process.env.SECRET
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressjwt({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    async (req, res, next) => {
      const account = await db.Account.findById(req.auth.id);
      const refreshTokens = await db.RefreshToken.find({ account: account.id });

      if (!account) {
        // account no longer exists or role not authorized
        return res.status(401).json({ message: 'Account no longer exists' });
      } else if (roles.length && !roles.includes(account.role)) {
        return res.status(401).json({ message: 'Denied access' });
      }

      // authentication and authorization successful
      req.auth.role = account.role;
      req.auth.ownsToken = token => !!refreshTokens.find(x => x.token === token);
      next();
    }
  ];
}
