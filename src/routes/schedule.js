const express = require('express');
const Route = express.Router();
const validator = require('../validator');
const upload = require('../helper/uploadImageUser');

const { getSchedule, getScheduleById } = require('../controller/schedule');

Route.get('/', getSchedule);
Route.get('/:id', getScheduleById);

module.exports = Route;
