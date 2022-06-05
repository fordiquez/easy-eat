const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
  date: Date,
  mealTime: String,
  measure: String,
  servings: Number,
  label: String,
  category: String,
  foodContentsLabel: Array,
  image: String,
  nutrients: Object,
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
