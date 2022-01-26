const jwt = require('express-jwt');
const db = require('helpers/db.helper');

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
    jwt({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    async (req, res, next) => {
      const account = await db.Account.findById(req.user.id);
      const refreshTokens = await db.RefreshToken.find({ account: account.id });

      if (!account) {
        // account no longer exists or role not authorized
        return res.status(401).json({ message: 'Account no longer exists' });
      } else if (roles.length && !roles.includes(account.role)) {
        return res.status(401).json({ message: 'Role not authorized' });
      }

      // authentication and authorization successful
      req.user.role = account.role;
      req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
      next();
    }
  ];
}
