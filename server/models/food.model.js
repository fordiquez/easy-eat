const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  date: Date,
  mealTime: String,
  measure: String,
  servings: Number,
  foodId: String,
  label: String,
  category: String,
  categoryLabel: String,
  nutrients: Object,
  image: String,
  created: { type: Date, default: Date.now() },
  updated: Date
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Food', schema);
