const express = require('express');
const Route = express.Router();
const validator = require('../validator');

const { updateProfileUser, updatePasswordUser } = require('../controller/user');

Route.put('/update/profile/:id', updateProfileUser);
Route.put('/update/password/:id', validator.updatepassword, updatePasswordUser);

module.exports = Route;
