const {
	loginUser,
	checkUsernameEmail,
	postUser,
	checkByEmail,
	checkById,
	updatePassword
} = require('../models/auth');
const { validationResult } = require('express-validator');
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
			const matchingPassword = bcrypt.compareSync(password, result.password);
			if (matchingPassword) {
				const { id, name, email, username, status } = result;
				const token = jwt.sign({ result }, 'RAHASIA', { expiresIn: '1h' });
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
		const { email } = request.body;
		try {
			const result = await checkByEmail(email);
			let id = result[0].id;
			// id = bcrypt.hashSync(`${id}`, 10);
			// const matchingPassword = bcrypt.compareSync(
			// 	'2',
			// 	'$2b$10$Rs1hbowM6vK8Py5517cPBOgUgNwM8rKsDSwLAF7jXesZvvCQV/3Ve'
			// );
			// console.log(matchingPassword);
			if (result.length > 0) {
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
					to: 'bagustri15@gmail.com', // list of receivers
					subject: 'BusTicks - Forgot Password', // Subject line
					html: `<b>Click This URL for reset password </b><a href="https://www.youtube.com/">Reset Password ${id}</a>` // html body
				});
				console.log('Message sent: %s', info.messageId);
			} else {
				console.log('gagal');
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	resetPassword: async (request, response) => {
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
					const passwordEncript = bcrypt.hashSync(password, 10);
					const result = await updatePassword(id, passwordEncript);
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
