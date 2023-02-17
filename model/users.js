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
    set: (v) => v.lowerCase(),
    match: /^[A-Za-z][A-Za-z0-9_.]{3,14}$/
  },
  password_encrypted: {
    type: String,
    required: true,
    set: (v) => bcrypt.hashSync(v, Math.max(5, Math.floor(Math.random() * 10)))
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
          const result = await this.model('User').findOne(doc).select({_id: 1, ign: 2, password_encrypted: 3});
          if (result) {
            if (result.comparePassword(pwd)) {
              resolve({success: {id: result._id, ign: result.ign, access_time: Date.now()}});
            } else
              resolve({error: { message: 'Invalid Password' } });
          } else
            resolve({error: { message: 'No Record Found' } });
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
            resolve({success: Object.assign(result._doc, {access_time: Date.now()})});
          else
            resolve({error: { message: 'No Record Found'}});
        } catch(err) {
          reject({error : {message: 'Error occured'}});
        }
      });      
    },
    findAllWithoutPassword(doc) {
      return new Promise(async (resolve, reject) => {
        try {
          if (typeof(doc) === "object") { // with search query
            const result = await this.model('User').find(doc).select({_id: 1, ign: 2, username: 3, creation_date: 4});
            if (result.length > 0)
              resolve({success: result});
            else
              resolve({error: {message: 'No Records Found'}});
          } else { // all records
            const result = await this.model('User').find().select({_id: 1, ign: 2, username: 3, creation_date: 4});
            if (result.length > 0)
              resolve({success: result});
            else
              resolve({error: {message: 'No Records Found'}});
          }
        } catch(err) {
          reject({error: {message: 'Error occured'}});
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
