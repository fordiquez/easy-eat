const mongoose = require('mongoose');
const Account = require('models/account.model')
const RefreshToken = require('models/refresh-token.model')
const Food = require('models/food.model')
const UserData = require('models/user-data.model')
const MealPlan = require('models/meal-plan.model')
const mongodb = require("mongodb");
const assert = require("assert");
const logger = require('utils/logger')

mongoose.connect(process.env.MONGODB_URI).then(() => {
  mongoose.Promise = global.Promise
  logger.info('Connected to MongoDB successfully')
}).catch(error => logger.error(Promise.reject(error)));

const isValidId = id => mongoose.Types.ObjectId.isValid(id)

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

function getAvatar(filename, res) {
  mongodb.MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (error, client) => {
    assert.ifError(error)
    const db = client.db()
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    const cursor = bucket.find({ filename })
    const avatar = {}
    cursor.forEach(doc => avatar.filename = doc.filename)
      .then(() => {
        if (avatar.filename === filename) {
          bucket.openDownloadStreamByName(filename).pipe(res)
        } else {
          res.json({ message: 'Avatar not found' })
          logger.error(`Avatar ${filename} not found`)
        }
      })
      .catch(error => res.json(error))
  })
}

function deleteAvatar(ObjectId) {
  mongodb.MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(error, client) => {
    assert.ifError(error)
    const db = client.db()
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    return bucket.delete(ObjectId)
  })
}