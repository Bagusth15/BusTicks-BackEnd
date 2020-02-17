const express = require('express');
const Route = express.Router();

const {
	getTerminal,
	getTerminalById,
	getTerminalByCity
} = require('../controller/terminal');

Route.get('/', getTerminal);
Route.get('/:id', getTerminalById);
Route.get('/city/:idCity', getTerminalByCity);

module.exports = Route;
