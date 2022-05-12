const mongoose = require('mongoose');
const Account = require('models/account.model')
const RefreshToken = require('models/refresh-token.model')
const Food = require('models/food.model')
const Photo = require('models/photo.model')
const mongodb = require("mongodb");
const assert = require("assert");

mongoose.connect(process.env.MONGODB_URI).then(r => mongoose.Promise = global.Promise).catch(error => {
    console.log(Promise.reject(error))
  });

module.exports = {
  Account,
  RefreshToken,
  Food,
  Photo,
  isValidId,
  getAvatar,
  deleteAvatar
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function getAvatar(filename, res) {
  mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(error, client) => {
    assert.ifError(error)
    const db = client.db('test')
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    return bucket.openDownloadStreamByName(filename).pipe(res)
  })
}

function deleteAvatar(ObjectId) {
  mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(error, client) => {
    assert.ifError(error)
    const db = client.db('test')
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'avatars' })
    return bucket.delete(ObjectId)
  })
}