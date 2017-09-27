'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { BoardGame } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  BoardGame.find()
    .then(games => {
      res.json(games);
    });
});

router.get('/:id', (req, res) => {
  BoardGame
    .findById(req.params.id)
    .then(games => {
      res.json(games);
    })
    .catch(err=> res.status(500).json({message:'internatl server error'}));
});

router.delete('/:id', (req, res) => {
  console.log('I should be deleting');
  BoardGame
    .findByIdAndRemove(req.params.id)
    .then(game => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'internal server error' }));
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

  let { bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl } = req.body;

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
