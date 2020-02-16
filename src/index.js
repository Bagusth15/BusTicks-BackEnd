const express = require('express');
const Route = express.Router();

const auth = require('./routes/auth');
const user = require('./routes/user');
const schedule = require('./routes/schedule');

Route.use('/auth', auth)
	.use('/user', user)
	.use('/schedule', schedule);

module.exports = Route;
