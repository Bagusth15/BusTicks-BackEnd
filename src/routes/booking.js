const express = require('express');
const Route = express.Router();
const validator = require('../validator');
const upload = require('../helper/uploadImageUser');
const helper = require('../helper');
const multer = require('multer');

const { getSeat } = require('../controller/booking');

Route.get('/seat/:idSchedule', getSeat);

module.exports = Route;
