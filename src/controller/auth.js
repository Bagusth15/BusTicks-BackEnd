const {
	loginUser,
	checkUsernameEmail,
	postUser,
	checkByEmail,
	checkById,
	updatePassword
} = require('../models/auth');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = {
	registerUser: async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ [err.param]: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		const { name, email, username, password, confirm_password } = request.body;
		try {
			const setData = {
				name: name,
				email: email,
				username: username,
				password: bcrypt.hashSync(password, 10),
				status: 1
			};
			let result = await checkUsernameEmail(username, email);
			if (result.length > 0) {
				return helper.response(response, 200, [], {
					email: 'Username and Email already used',
					username: 'Username and Email already used'
				});
			} else {
				if (password != confirm_password) {
					return helper.response(response, 200, [], {
						password: 'Password not match',
						confirm_password: 'Password not match'
					});
				} else {
					result = await postUser(setData);
					return helper.response(response, 200, result);
				}
			}
		} catch (error) {
			return helper.response(response, 400, error, 'Bad Request');
		}
	},
	loginUser: async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ [err.param]: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		const { username, password } = request.body;
		try {
			const result = await loginUser(username);
			if (result.length > 0) {
				const matchingPassword = bcrypt.compareSync(
					password,
					result[0].password
				);
				if (matchingPassword) {
					const { id, name, email, username, status } = result[0];
					const token = jwt.sign({ result }, process.env.KEY_PASSWORD, {
						expiresIn: '1h'
					});
					return helper.response(response, 200, {
						token,
						id,
						name,
						email,
						username,
						status
					});
				} else {
					return helper.response(
						response,
						200,
						[],
						'Incorrect username and password'
					);
				}
			} else {
				return helper.response(
					response,
					200,
					[],
					'Incorrect username and password'
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	forgotPasswordUser: async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ [err.param]: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}

		try {
			const { email } = request.body;
			const result = await checkByEmail(email);
			// id = bcrypt.hashSync(`${id}`, 10);
			// const matchingPassword = bcrypt.compareSync(
			// 	'2',
			// 	'$2b$10$Rs1hbowM6vK8Py5517cPBOgUgNwM8rKsDSwLAF7jXesZvvCQV/3Ve'
			// );
			if (result.length > 0) {
				const { id, email } = result[0];
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true, // true for 465, false for other ports
					auth: {
						user: 'memo.in.aja@gmail.com', // generated ethereal user
						pass: 'Memo050798' // generated ethereal password
					}
				});
				// send mail with defined transport object
				let info = await transporter.sendMail({
					from: '"BusTicks"', // sender address
					to: email, // list of receivers
					subject: 'BusTicks - Forgot Password', // Subject line
					html: `<b>Click This URL for reset password </b><a href="https://www.youtube.com/">Reset Password ${id}</a>` // html body
				});
				return helper.response(response, 200, result);
			} else {
				return helper.response(response, 200, [], { data: 'Data not found' });
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	resetPasswordUser: async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ [err.param]: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		try {
			const { id } = request.params;
			let { password, confirm_password } = request.body;
			const result = await checkById(id);
			if (result.length > 0) {
				if (password != confirm_password) {
					return helper.response(response, 200, [], {
						password: 'Password not match',
						confirm_password: 'Password not match'
					});
				} else {
					const data = {
						password: bcrypt.hashSync(password, 10),
						update_at: moment().format()
					};
					const result = await updatePassword(id, data);
					return helper.response(response, 200, result);
				}
			} else {
				return helper.response(response, 200, [], { data: 'Data not found' });
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
