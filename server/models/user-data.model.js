const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  currentWeight: Number,
  goalWeight: Number,
  height: Number,
  sex: String,
  birthdayDate: Date,
  activityLevel: String,
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

module.exports = mongoose.model('User_Data', schema);
