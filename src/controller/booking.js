const {
	getBooking,
	getBookingById,
	getBookingDetails,
	postBooking,
	checkingPrice,
	postBookingDetail,
	getTotal,
	updateBooking
} = require('../models/booking');
const { createPayment } = require('../models/payment');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const nodemailer = require('nodemailer');

module.exports = {
	getBooking: async (request, response) => {
		try {
			const result = await getBooking();
			for (let i = 0; i < result.length; i++) {
				result[i].booking = await getBookingDetails(result[i].id);
			}
			return helper.response(response, 200, result);
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	getBookingById: async (request, response) => {
		try {
			const { id } = request.params;
			const result = await getBookingById(id);
			for (let i = 0; i < result.length; i++) {
				result[i].booking = await getBookingDetails(result[i].id);
			}
			if (result.length > 0) {
				return helper.response(response, 200, result);
			} else {
				return helper.response(
					response,
					200,
					[],
					[{ error: 'Data not found' }]
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	postBooking: async (request, response) => {
		const lengthInvoice = 9;
		const invoicegenerate = Math.floor(
			Math.pow(10, lengthInvoice - 1) +
				Math.random() * 9 * Math.pow(10, lengthInvoice - 1)
		);
		try {
			setData = {
				id_user: request.body.id_user,
				invoice: invoicegenerate,
				id_schedule: request.body.id_schedule
			};
			const booking = request.body.booking;
			if (booking == '' || booking == undefined) {
				return helper.response(
					response,
					200,
					[],
					[{ error: 'Seat cannot be empty' }]
				);
			} else {
				let result = await postBooking(setData);
				const { id, id_schedule } = result;
				booking.map(async item => {
					result = await checkingPrice(id_schedule);
					const { price } = result[0];
					setDataBooking = {
						id_booking: id,
						id_schedule: id_schedule,
						no_identity: item.no_identity,
						name: item.name,
						seat: item.seat,
						price: price
					};
					result = await postBookingDetail(setDataBooking);
					result = await getTotal(id);
					const { Total } = result[0];
					result = await createPayment(id, Total);
					result = await updateBooking(result, Total, id);
					result = await getBookingById(id);
					for (let i = 0; i < result.length; i++) {
						result[i].booking = await getBookingDetails(result[i].id);
					}
					return helper.response(response, 200, result);
				});
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
