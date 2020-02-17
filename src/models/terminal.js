const connection = require('../config/mysql');

module.exports = {
	getTerminal: () => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM terminal JOIN city ON terminal.id_city = city.id',
				(error, result) => {
					if (!error) {
						resolve(result);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	},
	getTerminalById: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM terminal JOIN city ON terminal.id_city = city.id WHERE terminal.id = ?',
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
	},
	getTerminalByCity: idCity => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM terminal JOIN city ON terminal.id_city = city.id WHERE terminal.id_city = ?',
				idCity,
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
