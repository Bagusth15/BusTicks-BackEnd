const connection = require('../config/mysql');

module.exports = {
	getBus: () => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM bus', (error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(new Error(error));
				}
			});
		});
	},
	getBusById: id => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM bus WHERE id=?', id, (error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(new Error(error));
				}
			});
		});
	}
};
