const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  ign: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z][A-Za-z0-9_.*]{3,14}$/
  },
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z][A-Za-z0-9_.]{3,14}$/
  },
  password_encrypted: {
    type: String,
    required: true,
    set: (v) => bcrypt.hashSync(v, Math.max(10, Math.floor(Math.random() * 16)))
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
}, {
  statics: {
    findOneWithPassword(doc, pwd) {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await this.model('User').findOne(doc).select({_id: 1, password_encrypted: 2});
          if (result) {
            if (result.comparePassword(pwd, result.password_encrypted)) {
              resolve({id: result._id});
            } else
              reject({message: 'Invalid Password'});
          } else
            reject({message: 'No Record Found'});
        } catch(err) {
          reject({message: 'Error Occured'});
        }
      });
    },
    findOneWithoutPassword(doc) {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await this.model('User').findOne(doc).select({_id: 1, ign: 2, username: 3, creation_date: 4});
          if (result)
            resolve(result);
          else
            reject({message: 'No Record Found'});
        } catch(err) {
          reject({message: 'Error occured'});
        }
      });      
    },
    findAllWithoutPassword(doc) {
      return new Promise(async (resolve, reject) => {
        if (typeof(doc) === "object") { // with search query
          const result = await this.model('User').find(doc).select({_id: 1, ign: 2, username: 3, creation_date: 4});
          if (result.length > 0)
            resolve(result);
          else
            reject({message: 'No Records Found'});
        } else { // all records
          const result = await this.model('User').find().select({_id: 1, ign: 2, username: 3, creation_date: 4});
          if (result.length > 0)
            resolve(result);
          else
            reject({message: 'No Records Found'});
        }
      });
    }
  },
  methods: {
    comparePassword(pwd) {
      const result = bcrypt.compareSync(pwd, this.password_encrypted);
      return result;
    }
  },
  query: {
    byIGN(ign) {
      return this.where('ign', new RegExp(ign, 'i'));
    },
    byUsername(username) {
      return this.where('username', new RegExp(username, 'i'));
    },
    byID(id) {
      return this.where('_id', new RegExp(id, 'i'));
    }
  }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
