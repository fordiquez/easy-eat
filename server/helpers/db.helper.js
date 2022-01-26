const mongoose = require('mongoose');

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true };
mongoose.connect(process.env.MONGODB_URI)
  .then(r => mongoose.Promise = global.Promise)
  .catch(error => {
    console.log(Promise.reject(error))
  });

module.exports = {
  Account: require('models/account.model'),
  RefreshToken: require('models/refresh-token.model'),
  isValidId
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
