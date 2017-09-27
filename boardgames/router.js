'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { BoardGame } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  res.json('get working');
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['bgg_url', 'name', 'minPlayers', 'maxPlayers', 'avgTime', 'avgRating', 'imgUrl'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  // const stringFields = ['username', 'password'];
  // const nonStringField = stringFields.find(
  //   field => field in req.body && typeof req.body[field] !== 'string'
  // );

  // if (nonStringField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: 'Incorrect field type: expected string',
  //     location: nonStringField
  //   });
  // }

  // const explicityTrimmedFields = ['username', 'password'];
  // const nonTrimmedField = explicityTrimmedFields.find(
  //   field => req.body[field].trim() !== req.body[field]
  // );

  // if (nonTrimmedField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: 'Cannot start or end with whitespace',
  //     location: nonTrimmedField
  //   });
  // }

  // const sizedFields = {
  //   username: { min: 1 },
  //   password: { min: 10, max: 72 }
  // };
  // const tooSmallField = Object.keys(sizedFields).find(field =>
  //   'min' in sizedFields[field] &&
  //   req.body[field].trim().length < sizedFields[field].min
  // );
  // const tooLargeField = Object.keys(sizedFields).find(field =>
  //   'max' in sizedFields[field] &&
  //   req.body[field].trim().length > sizedFields[field].max
  // );

  // if (tooSmallField || tooLargeField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: tooSmallField
  //       ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
  //       : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
  //     location: tooSmallField || tooLargeField
  //   });
  // }

  let {bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl} = req.body;

  return BoardGame.find({ bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl })
    // .count()
    // .then(count => {
    //   if (count > 0) {
    //     return Promise.reject({
    //       code: 422,
    //       reason: 'ValidationError',
    //       message: 'Username already taken',
    //       location: 'username'
    //     });
    //   }
    //   return User.hashPassword(password);
    // })
    .then(item => {
      return BoardGame.create({ bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl });
    })
    .then(data => {
      return res.status(201).json(data);
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


module.exports = { router };