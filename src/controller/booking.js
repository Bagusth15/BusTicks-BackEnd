const { getSeat } = require('../models/booking');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports = {
	getSeat: async (request, response) => {
		try {
			const { idSchedule } = request.params;
			const result = await getSeat(idSchedule);
			if (result.length > 0) {
				return helper.response(response, 200, result);
			} else {
				return helper.response(
					response,
					200,
					[],
					[{ error: 'Data not found' }]
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
	// detailUser: async (request, response) => {
	// 	try {
	// 		const { id } = request.params;
	// 		const result = await checkById(id);
	// 		if (result.length > 0) {
	// 			return helper.response(response, 200, result);
	// 		} else {
	// 			return helper.response(response, 200, [], { data: 'Data not found' });
	// 		}
	// 	} catch (error) {
	// 		return helper.response(response, 400, error);
	// 	}
	// }
};
