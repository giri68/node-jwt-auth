'use strict';

const bcrypt = require('bcryptjs');
const knex = require('knex');

knex.Promise = global.Promise;

const UserSchema = knex.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.apiRepr = function () {
  return { username: this.username };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = knex.models.User || knex.model('User', UserSchema);

module.exports = { User };
