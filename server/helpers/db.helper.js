const mongoose = require('mongoose');
const Account = require('models/account.model')
const RefreshToken = require('models/refresh-token.model')
const Food = require('models/food.model')
const UserData = require('models/user-data.model')
const MealPlan = require('models/meal-plan.model')
const mongodb = require("mongodb");
const assert = require("assert");

mongoose.connect(process.env.MONGODB_URI).then(r => mongoose.Promise = global.Promise).catch(error => {
    console.log(Promise.reject(error))
  });

module.exports = {
  Account,
  RefreshToken,
  Food,
  UserData,
  MealPlan,
  isValidId,
  getAvatar,
  deleteAvatar
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function getAvatar(filename, res) {
  mongodb.MongoClient.connect(process.env.MONGODB_CLIENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(error, client) => {
    const db = client.db(process.env.MONGODB_NAME)
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    const cursor = bucket.find({ filename })
    const avatar = {}
    cursor.forEach(doc => avatar.filename = doc.filename)
      .then(() => avatar.filename === filename ? bucket.openDownloadStreamByName(filename).pipe(res) : res.json({ message: 'Avatar not found' }))
      .catch(error => res.json(error))
  })
}

function deleteAvatar(ObjectId) {
  mongodb.MongoClient.connect(process.env.MONGODB_CLIENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(error, client) => {
    assert.ifError(error)
    const db = client.db(process.env.MONGODB_NAME)
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    return bucket.delete(ObjectId)
  })
}