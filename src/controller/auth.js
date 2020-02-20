const {
	loginUser,
	checkUsername,
	checkEmail,
	postUser,
	checkByEmail,
	updatePassword,
	updateKeys,
	checkTimeKey
} = require('../models/auth');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const sendMail = require('../helper/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
			const userKeys = Math.floor(1000 + Math.random() * 9000);
			const { email } = request.body;
			const result = await checkByEmail(email);
			if (result.length > 0) {
				const { id, email } = result[0];
				await sendMail.forgot(email, userKeys);
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
							key_user: '',
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
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
