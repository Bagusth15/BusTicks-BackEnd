const express = require('express');
const Route = express.Router();
const validator = require('../validator');

const {
	loginUser,
	registerUser,
	forgotPasswordUser,
	resetPassword
} = require('../controller/auth');

Route.post('/login', validator.login, loginUser);
Route.post('/register', validator.register, registerUser);
Route.post('/forgot', validator.forgot, forgotPasswordUser);
Route.post('/reset/:id', validator.resetpassword, resetPassword);

module.exports = Route;
