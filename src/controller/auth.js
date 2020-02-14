const { loginUser } = require('../models/auth');
const helper = require('../helper');
const jwt = require('jsonwebtoken');

module.exports = {
	loginUser: async (request, response) => {
		try {
			const data = {
				username: request.body.username,
				password: request.body.password
			};
			const result = await loginUser(data);
			const { id, username, name } = result;
			const token = jwt.sign({ result }, 'RAHASIA', { expiresIn: '1h' });
			return helper.response(response, 200, { token, id, username, name });
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
