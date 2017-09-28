'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { BoardGame } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jsonParser, (req, res) => {
  BoardGame
    .find()
    .then(games => {
      res.json(games);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Search failed'});
    });
});

router.get('/:id', jsonParser, (req, res)  => {
  BoardGame
    .findById(req.params.id)
    .then(race => {
      res.json(race.apiRepr());
    })
    .catch(err => {
      res.status(500).json({error: 'internal server error'});
    });
});

router.post('/', jsonParser, jwtAuth,(req, res) => {
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

  router.delete('/:id', (req, res) => {
    BoardGame
      .findByIdAndRemove(req.params.id)
      .then(() => {
        req.status(204).end();
      });
  });

  let { bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl } = req.body;

  return BoardGame.find({ bgg_url, name, minPlayers, maxPlayers, avgTime, avgRating, imgUrl })
    
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
