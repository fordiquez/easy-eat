const { expressjwt } = require('express-jwt');
const db = require('utils/db');

module.exports = authorize;

function authorize(roles = []) {
  const secret = process.env.SECRET

  if (typeof roles === 'string') roles = [roles]

  return [
    expressjwt({ secret, algorithms: ['HS256'] }),

    async (req, res, next) => {
      const account = await db.Account.findById(req.auth.id);
      const refreshTokens = await db.RefreshToken.find({ account: account.id });

      if (!account) {
        return res.status(401).json({ message: 'Account no longer exists' });
      } else if (roles.length && !roles.includes(account.role)) {
        return res.status(401).json({ message: 'Denied access' });
      }

      req.auth.role = account.role;
      req.auth.ownsToken = token => !!refreshTokens.find(x => x.token === token);
      next();
    }
  ];
}
