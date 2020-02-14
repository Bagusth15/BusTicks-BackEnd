const express = require('express');
const Route = express.Router();

const { loginUser } = require('../controller/auth');

Route.post('/login', loginUser);

module.exports = Route;
