const midtransClient = require('midtrans-client');
const connection = require('../config/mysql');

module.exports = {
	createPayment: (id, Total) => {
		return new Promise((resolve, reject) => {
			let snap = new midtransClient.Snap({
				isProduction: false,
				serverKey: process.env.SERVER_KEY_MIDTRANS,
				clientKey: process.env.CLIENT_KEY_MIDTRANS
			});
			let parameter = {
				transaction_details: {
					order_id: id,
					gross_amount: Total
				}
			};
			return snap
				.createTransaction(parameter)
				.then(transaction => resolve(transaction.redirect_url))
				.catch(error => {
					reject(error);
				});
		});
	},
	putBooking: (id, payment_status) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`UPDATE booking SET payment_status='${payment_status}' WHERE id=${id}`,
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
	deleteSeat: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`DELETE FROM bookingdetail WHERE id_booking=?`,
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
