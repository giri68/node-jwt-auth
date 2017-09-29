'use strict';

const {router, jwtAuth} = require('./router');
const {basicStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, basicStrategy, jwtStrategy};
