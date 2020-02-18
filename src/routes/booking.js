const express = require('express');
const Route = express.Router();
const validator = require('../validator');

const {
	getBooking,
	getBookingById,
	postBooking
} = require('../controller/booking');

Route.get('/', getBooking);
Route.get('/:id', getBookingById);
Route.post('/', postBooking);

module.exports = Route;
