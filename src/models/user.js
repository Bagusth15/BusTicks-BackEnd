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
	},
	updatePassword: (data, id) => {
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
	},
	checkByUsername: username => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT id, username, email, image FROM user WHERE username = ?',
				[username],
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
				'SELECT id, username, email, image FROM user WHERE email = ?',
				[email],
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
	updateUser: (setData, id) => {
		return new Promise((resolve, reject) => {
			connection.query(
				'UPDATE user SET ? WHERE id=?',
				[setData, id],
				(error, result) => {
					if (!error) {
						const newResult = {
							id: id,
							...setData
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
