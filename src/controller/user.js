const { checkById, updatePassword } = require('../models/user');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = {
	updateProfileUser: async (request, response) => {
		const { id } = request.params;
		// const data = request.body.name;
		// const data = {
		// 	name: request.body.name
		// };
		console.log(request.body);
		try {
			console.log(id);
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	updatePasswordUser: async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ [err.param]: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		const { id } = request.params;
		try {
			const result = await checkById(id);
			if (result.length > 0) {
				const { old_password, new_password, confirm_password } = request.body;
				const matchingPassword = bcrypt.compareSync(
					old_password,
					result[0].password
				);
				if (new_password != confirm_password) {
					return helper.response(response, 200, [], {
						password: 'Password not match',
						confirm_password: 'Password not match'
					});
				} else {
					if (!matchingPassword) {
						return helper.response(response, 200, [], {
							old_password: 'Old password incorrect'
						});
					} else {
						const data = {
							password: bcrypt.hashSync(new_password, 10),
							update_at: moment().format()
						};
						const result = await updatePassword(data, id);
						return helper.response(response, 200, result);
					}
				}
			} else {
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
