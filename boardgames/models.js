const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const boardGameScheuma = mongoose.Schema({
  bgg_url:{
    type: String, 
    required: true,
    unique:true
  },
  name:{
    type: String, 
    required: true,
    unique:true
  },
  minPlayers:{
    type: Number, 
    required: true
  },
  maxPlayers:{
    type: Number, 
    required: true
  },
  avgTime:{
    type: Number, 
    required: true
  },
  avgRating:{
    type: Number, 
    required: true
  },
  imgUrl:{
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { User };