const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

const PhotoModel = mongoose.model('Photo', schema);

module.exports = PhotoModel;