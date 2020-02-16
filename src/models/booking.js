const connection = require('../config/mysql');

module.exports = {
	checkById: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id, username, email, password, image FROM user WHERE id = ?',
				id,
				(error, result) => {
					if (!error) {
						resolve(result);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	}
};
