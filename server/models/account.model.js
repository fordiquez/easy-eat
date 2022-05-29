const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'avatars.files'
    },
    filename: String
  },
  role: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordReset: Date,
  verificationToken: String,
  resetToken: {
    token: String,
    expires: Date
  },
  acceptedTerms: Boolean,
  verified: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
});

schema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  }
});

module.exports = mongoose.model('Account', schema);
