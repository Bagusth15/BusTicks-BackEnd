const connection = require('../config/mysql');

module.exports = {
	loginUser: data => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id, username, name FROM user WHERE username = ? AND password = ? ',
				[data.username, data.password],
				(error, result) => {
					if (!error) {
						resolve(result[0]);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	}
};
