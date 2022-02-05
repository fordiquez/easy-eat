const mongoose = require('mongoose');
const Account = require('models/account.model')
const RefreshToken = require('models/refresh-token.model')
const Product = require('models/product.model')

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true };
mongoose.connect(process.env.MONGODB_URI)
  .then(r => mongoose.Promise = global.Promise)
  .catch(error => {
    console.log(Promise.reject(error))
  });

module.exports = {
  Account,
  RefreshToken,
  Product,
  isValidId
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
