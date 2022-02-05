const db = require('helpers/db.helper');

const create = async (params, origin) => {
  if (await db.Product.findOne({ ingredient: params.ingredient })) {
    throw 'Product with such ingredient has already been registered.'
  }

  const product = new db.Product(params);
  await product.save();

  return product
}

module.exports = {
  create,
};
