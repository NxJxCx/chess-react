const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  ign: {
    type: String,
    required: true,
    match: /^[A-Za-z][A-Za-z0-9_.*]{3,14}$/
  },
  username: {
    type: String,
    required: true,
    match: /^[A-Za-z][A-Za-z0-9_.]{3,14}$/
  },
  password_encrypted: {
    type: String,
    required: true
  },
  password_salt: {
    type: String,
    required: true
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
