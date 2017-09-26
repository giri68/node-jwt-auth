const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const boardGameSchema = mongoose.Schema({
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

const BoardGame = mongoose.models.BoardGame || mongoose.model('BoardGame', boardGameSchema);

module.exports = { BoardGame };