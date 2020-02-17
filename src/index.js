const express = require('express');
const Route = express.Router();

const auth = require('./routes/auth');
const user = require('./routes/user');
const schedule = require('./routes/schedule');
const terminal = require('./routes/terminal');
const city = require('./routes/city');
const bus = require('./routes/bus');

Route.use('/auth', auth)
	.use('/user', user)
	.use('/schedule', schedule)
	.use('/terminal', terminal)
	.use('/city', city)
	.use('/bus', bus);

module.exports = Route;
