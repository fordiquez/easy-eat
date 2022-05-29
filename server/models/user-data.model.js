const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
  currentWeight: Number,
  goalWeight: Number,
  height: Number,
  sex: String,
  birthdayDate: Date,
  activityLevel: String,
  caloriesGoal: { type: String, default: null },
  BMR: { type: Number, default: null },
  TDEE: { type: Number, default: null },
  macros: { type: Object, default: null },
  selectedPlan: { type: Schema.Types.ObjectId, ref: 'Meal_Plan', default: null },
  customProportions: { type: Object, default: null },
  created: { type: Date, default: Date.now },
  updated: Date
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('User_Data', schema);
