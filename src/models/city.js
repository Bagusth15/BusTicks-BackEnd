const connection = require('../config/mysql');

module.exports = {
	getCity: () => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM city', (error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(new Error(error));
				}
			});
		});
	}
};
