const connection = require('../config/mysql');

module.exports = {
	checkUsername: username => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT username, email FROM user WHERE username = ?`,
				username,
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
	checkEmail: email => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT username, email FROM user WHERE email = ?`,
				email,
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
	postUser: setData => {
		return new Promise((resolve, reject) => {
			connection.query(`INSERT INTO user SET ?`, setData, (error, result) => {
				if (!error) {
					const newResult = {
						id: result.insertId,
						...setData
					};
					delete newResult.password;
					resolve(newResult);
				} else {
					reject(new Error(error));
				}
			});
		});
	},
	loginUser: username => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id, username, name, email, status, password FROM user WHERE username = ?',
				username,
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
	checkByEmail: email => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id, email FROM user WHERE email = ?',
				email,
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
	checkById: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id FROM user WHERE id = ?',
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
	updatePassword: (id, data) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`UPDATE user SET password=?, update_at=? WHERE id=?`,
				[data.password, data.update_at, id],
				(error, result) => {
					if (!error) {
						const newResult = {
							id: id
						};
						resolve(newResult);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	}
};
