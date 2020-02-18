const connection = require('../config/mysql');

module.exports = {
	getBooking: () => {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM booking`, (error, result) => {
				if (!error) {
					resolve(result);
				} else {
					reject(new Error(error));
				}
			});
		});
	},
	getBookingById: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM booking WHERE id=?`,
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
	getBookingDetails: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM bookingdetail WHERE id_booking=?`,
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
	postBooking: setData => {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO booking SET ?`,
				setData,
				(error, result) => {
					if (!error) {
						const newResult = {
							id: result.insertId,
							...setData
						};
						resolve(newResult);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	},
	checkingPrice: id_schedule => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT price FROM schedule WHERE id =?`,
				id_schedule,
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
	postBookingDetail: setDataBooking => {
		return new Promise((resolve, reject) => {
			connection.query(
				`INSERT INTO bookingdetail SET ?`,
				setDataBooking,
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
	getTotal: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT SUM(price) AS Total FROM bookingdetail WHERE id_booking=?`,
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
	updateBooking: (Total, id) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`UPDATE booking SET total_price = ? WHERE id=?`,
				[Total, id],
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
