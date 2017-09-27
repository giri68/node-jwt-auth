<<<<<<< HEAD
'use strict';
=======
// route her for endpoint /api/auth/
>>>>>>> e5654243479c9ae38bc6178b7e154799e7ffa877

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    // algorithm: 'HS256'
  });
};

const basicAuth = passport.authenticate('basic', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

<<<<<<< HEAD
router.post('/login', basicAuth, (req, res) => {
  const authToken = createAuthToken(req.user.apiRepr());
  res.json({ authToken });
});
=======
router.post(
    '/login',
    // The user provides a username and password to login via headers/authorization
    passport.authenticate('basic', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user.apiRepr());
        res.json({authToken});
    }
);
>>>>>>> e5654243479c9ae38bc6178b7e154799e7ffa877

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
