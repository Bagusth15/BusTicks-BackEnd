const midtransClient = require('midtrans-client');

module.exports = {
	createPayment: () => {
		return new Promise((resolve, reject) => {
			let snap = new midtransClient.Snap({
				isProduction: false,
				serverKey: process.env.SERVER_KEY_MIDTRANS,
				clientKey: process.env.CLIENT_KEY_MIDTRANS
			});
			let parameter = {
				transaction_details: {
					order_id: 'test-transaction-125',
					gross_amount: 200000
				}
			};
			return snap.createTransaction(parameter).then(transaction => {
				// transaction redirect_url
				let redirectUrl = transaction.redirect_url;
				console.log('redirectUrl:', redirectUrl);
			});
		});
	}
};
