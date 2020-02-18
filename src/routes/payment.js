const express = require('express');
const Route = express.Router();

const { postMidtransNotification } = require('../controller/payment');

Route.post('/midtrans-notification', postMidtransNotification);

module.exports = Route;
