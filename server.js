'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const {DATABASE, PORT} = reuqire('./config');
const knex = require('knex')(DATABASE);

require('dotenv').config();

const { router: usersRouter } = require('./users');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { PORT, DATABASE_URL } = require('./config');
const jwtAuth = passport.authenticate('jwt', { session: false });



passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use(morgan('common', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(cors());
app.use(bodyParser.jason());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({ data: 'rosebud' });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;
function runServer(database = DATABASE, port = PORT) {
  return new Promise((resolve, reject) => {
    try {
      knex = require('knex')(database);
      server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
        resolve();
      });
    }
    catch (err) {
      console.error(`Can't start server: ${err}`);
      reject(err);
    }
  });
}

function closeServer() {
  return knex.destroy().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing servers');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
