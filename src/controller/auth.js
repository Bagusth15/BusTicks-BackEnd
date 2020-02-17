const {
	loginUser,
	checkUsername,
	checkEmail,
	postUser,
	checkByEmail,
	checkById,
	updatePassword,
	updateKeys,
	checkTimeKey
} = require('../models/auth');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userKey = 4;
const userKeys = Math.floor(
	Math.pow(10, userKey - 1) + Math.random() * 9 * Math.pow(10, userKey - 1)
);

module.exports = {
	registerUser: async (request, response) => {
		const { name, email, username, password, confirm_password } = request.body;
		const errors = validationResult(request);
		if (
			name == '' &&
			email == '' &&
			username == '' &&
			password == '' &&
			confirm_password == ''
		) {
			return helper.response(
				response,
				200,
				[],
				[
					{
						error: 'All column must be filled'
					}
				]
			);
		}
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ error: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		try {
			const setData = {
				name: name,
				email: email,
				username: username,
				password: bcrypt.hashSync(password, 10),
				status: 1
			};
			const resultUsername = await checkUsername(username);
			const resultEmail = await checkEmail(email);
			if (resultUsername.length > 0) {
				return helper.response(
					response,
					200,
					[],
					[
						{
							error: 'Username already used'
						}
					]
				);
			} else if (resultEmail.length > 0) {
				return helper.response(
					response,
					200,
					[],
					[
						{
							error: 'Email already used'
						}
					]
				);
			} else {
				if (password != confirm_password) {
					return helper.response(
						response,
						200,
						[],
						[
							{
								error: 'Password not match'
							}
						]
					);
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
		const { username, password } = request.body;
		if (username == '' && password == '') {
			return helper.response(
				response,
				200,
				[],
				[
					{
						error: 'All column must be filled'
					}
				]
			);
		}
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ error: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		try {
			const result = await loginUser(username);
			if (result.length > 0) {
				const matchingPassword = bcrypt.compareSync(
					password,
					result[0].password
				);
				if (matchingPassword) {
					const {
						id,
						name,
						email,
						username,
						image,
						create_at,
						update_at
					} = result[0];
					const token = jwt.sign({ result }, process.env.KEY_PASSWORD, {
						expiresIn: '1h'
					});
					return helper.response(response, 200, {
						token,
						id,
						name,
						email,
						username,
						image,
						create_at,
						update_at
					});
				} else {
					return helper.response(
						response,
						200,
						[],
						[
							{
								error: 'Incorrect username and password'
							}
						]
					);
				}
			} else {
				return helper.response(
					response,
					200,
					[],
					[
						{
							error: 'Incorrect username and password'
						}
					]
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
				.map(err => extractedErrors.push({ error: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}

		try {
			const { email } = request.body;
			const result = await checkByEmail(email);
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
					html: `<b>Please input the code for reset password : </b> ${userKeys}` // html body
				});
				const dataReset = {
					id: id,
					userKeys: userKeys,
					update_at: moment().format()
				};
				await updateKeys(dataReset);
				return helper.response(response, 200, result);
			} else {
				return helper.response(
					response,
					200,
					[],
					[{ error: 'Email not found' }]
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	resetPasswordUser: async (request, response) => {
		const { id } = request.params;
		const { password, confirm_password, key_user } = request.body;
		if (password == '' && confirm_password == '' && key_user == '') {
			return helper.response(
				response,
				200,
				[],
				[
					{
						error: 'All column must be filled'
					}
				]
			);
		}
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const extractedErrors = [];
			errors
				.array({ onlyFirstError: true })
				.map(err => extractedErrors.push({ error: err.msg }));
			return helper.response(response, 200, [], extractedErrors);
		}
		try {
			const result = await checkById(id);
			if (result.length > 0) {
				if (password != confirm_password) {
					return helper.response(
						response,
						200,
						[],
						[
							{
								error: 'Password not match'
							}
						]
					);
				} else {
					console.log(key_user);
					const result = await checkTimeKey(key_user);
					if (result.length > 0) {
						const { id, minute_diff } = result[0];
						if (minute_diff < -5) {
							return helper.response(
								response,
								200,
								[],
								[
									{
										error: 'User key expired'
									}
								]
							);
						} else {
							const data = {
								password: bcrypt.hashSync(password, 10),
								update_at: moment().format()
							};
							const result = await updatePassword(id, data);
							return helper.response(response, 200, result);
						}
					} else {
						return helper.response(
							response,
							200,
							[],
							[
								{
									error: 'User key not valid'
								}
							]
						);
					}
				}
			} else {
				return helper.response(
					response,
					200,
					[],
					[{ error: 'User not found' }]
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
