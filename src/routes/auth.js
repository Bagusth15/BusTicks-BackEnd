const express = require('express');
const Route = express.Router();
const validator = require('../validator');

const {
	loginUser,
	registerUser,
	forgotPasswordUser,
	resetPasswordUser
} = require('../controller/auth');

Route.post('/login', validator.login, loginUser);
Route.post('/register', validator.register, registerUser);
Route.post('/forgot', validator.forgot, forgotPasswordUser);
Route.put('/reset/', validator.resetpassword, resetPasswordUser);

module.exports = Route;
