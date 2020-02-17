const {
	checkById,
	updatePassword,
	checkByUsername,
	updateUser,
	checkByEmail
} = require('../models/user');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const fs = require('fs');

module.exports = {
	updateProfileUser: async (request, response) => {
		const { id } = request.params;
		const { name, email, username } = request.body;
		if (name == '' && email == '' && username == '') {
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

		const setData = {
			name: name,
			email: email,
			username: username,
			image: request.file === undefined ? '' : request.file.filename,
			update_at: moment().format()
		};
		const result = await checkById(id);
		try {
			if (result.length > 0) {
				const old_username = result[0].username;
				const new_username = setData.username;
				const old_email = result[0].email;
				const new_email = setData.email;
				const old_image = result[0].image;
				const new_image = setData.image;
				if (new_username != old_username) {
					const result = await checkByUsername(new_username);
					if (result.length > 0) {
						return helper.response(
							response,
							200,
							[],
							[
								{
									error: 'Username already exist'
								}
							]
						);
					} else {
						if (old_image != '') {
							if (new_image != '') {
								fs.unlink('uploads/userProfile/' + old_image, error => {
									if (error) throw error;
								});
							}
						}
						const result = await updateUser(setData, id);
						return helper.response(response, 200, result);
					}
				} else if (new_email != old_email) {
					const result = await checkByEmail(new_email);
					if (result.length > 0) {
						return helper.response(
							response,
							200,
							[],
							[
								{
									error: 'Email already exist'
								}
							]
						);
					} else {
						if (old_image != '') {
							if (new_image != '') {
								fs.unlink('uploads/userProfile/' + old_image, error => {
									if (error) throw error;
								});
							}
						}
						const result = await updateUser(setData, id);
						return helper.response(response, 200, result);
					}
				} else {
					if (old_image != '') {
						if (new_image != '') {
							fs.unlink('uploads/userProfile/' + old_image, error => {
								if (error) throw error;
							});
						}
					}
					const result = await updateUser(setData, id);
					return helper.response(response, 200, result);
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
	},
	updatePasswordUser: async (request, response) => {
		const { id } = request.params;
		const { old_password, new_password, confirm_password } = request.body;
		if (old_password == '' && new_password == '' && confirm_password == '') {
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
				const matchingPassword = bcrypt.compareSync(
					old_password,
					result[0].password
				);
				if (new_password != confirm_password) {
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
					if (!matchingPassword) {
						return helper.response(
							response,
							200,
							[],
							[
								{
									error: 'Old password incorrect'
								}
							]
						);
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
	},
	detailUser: async (request, response) => {
		try {
			const { id } = request.params;
			const result = await checkById(id);
			if (result.length > 0) {
				return helper.response(response, 200, result);
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
