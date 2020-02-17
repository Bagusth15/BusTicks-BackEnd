const express = require('express');
const Route = express.Router();

const { getCity } = require('../controller/city');

Route.get('/', getCity);

module.exports = Route;
