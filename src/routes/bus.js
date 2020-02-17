const express = require('express');
const Route = express.Router();

const { getBus, getBusById } = require('../controller/bus');

Route.get('/', getBus);
Route.get('/:id', getBusById);

module.exports = Route;
