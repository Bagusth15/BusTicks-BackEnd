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
				`SELECT booking.id, user.email, booking.invoice, booking.id_schedule, booking.total_price, booking.payment_link, booking.payment_status, booking.create_at, booking.update_at FROM booking JOIN user ON booking.id_user = user.id WHERE booking.id=?`,
				id,
				(error, result) => {
					if (!error) {
						delete result[0].password;
						delete result[0].key_user;
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
	updateBooking: (result, Total, id) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`UPDATE booking SET total_price = ?, payment_link=?, payment_status='pending' WHERE id=?`,
				[Total, result, id],
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
