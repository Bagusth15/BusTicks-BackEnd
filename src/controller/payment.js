const { putBooking, deleteSeat } = require('../models/payment');
const midtransClient = require('midtrans-client');
const helper = require('../helper');

module.exports = {
	postMidtransNotification: async (request, response) => {
		let snap = new midtransClient.Snap({
			isProduction: false,
			serverKey: process.env.SERVER_KEY_MIDTRANS,
			clientKey: process.env.CLIENT_KEY_MIDTRANS
		});
		snap.transaction
			.notification(request.body)
			.then(statusResponse => {
				let orderId = statusResponse.order_id;
				let transactionStatus = statusResponse.transaction_status;
				let fraudStatus = statusResponse.fraud_status;

				if (transactionStatus == 'capture') {
					if (fraudStatus == 'challenge') {
						return putBooking(orderId, fraudStatus);
					} else if (fraudStatus == 'accept') {
						return putBooking(orderId, fraudStatus);
					}
				} else if (
					transactionStatus == 'cancel' ||
					transactionStatus == 'deny' ||
					transactionStatus == 'expire'
				) {
					let result = putBooking(orderId, transactionStatus);
					result = deleteSeat(orderId);
					return result;
				} else if (transactionStatus == 'pending') {
					return putBooking(orderId, transactionStatus);
				} else if (transactionStatus == 'settlement') {
					return putBooking(orderId, transactionStatus);
				}
			})
			.then(() => {
				return helper.response(response, 200, 'OKE');
			})
			.catch(error => {
				return helper.response(response, 400, error);
			});
	}
};
