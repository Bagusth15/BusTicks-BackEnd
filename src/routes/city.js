const express = require('express');
const Route = express.Router();

const { getCity, getCityById } = require('../controller/city');

Route.get('/', getCity);
Route.get('/:id', getCityById);

module.exports = Route;
