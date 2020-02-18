const express = require('express');
const Route = express.Router();
const validator = require('../validator');
const upload = require('../helper/uploadImageUser');

const {
	getSchedule,
	getScheduleById,
	getSeat
} = require('../controller/schedule');

Route.get('/', getSchedule);
Route.get('/:id', getScheduleById);
Route.get('/seat/:id', getSeat);

module.exports = Route;
