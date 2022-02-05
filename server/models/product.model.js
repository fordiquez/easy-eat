const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  ingredient: String,
  calories: String,
  cautions: Array,
  dietLabels: Array,
  healthLabels: Array,
  totalDaily: Array,
  totalNutrients: Array,
  totalWeight: Number
});

module.exports = mongoose.model('Product', schema);
