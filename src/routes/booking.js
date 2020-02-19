const express = require('express');
const Route = express.Router();
const validator = require('../validator');

const {
	getBooking,
	getBookingById,
	postBooking,
	getBookingUser
} = require('../controller/booking');

Route.get('/', getBooking);
Route.get('/:id', getBookingById);
Route.get('/user/:id', getBookingUser);
Route.post('/', postBooking);

module.exports = Route;
