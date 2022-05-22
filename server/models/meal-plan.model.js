const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  mealGoal: String,
  BMR: Number,
  TDEE: Number,
  macros: Object,
  selectedDiet: {
    title: String,
    proportions: Object
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Meal_Plan', schema);
