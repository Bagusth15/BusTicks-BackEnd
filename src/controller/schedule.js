const {
	getPage,
	getSchedule,
	getScheduleById,
	getSeat,
	checkSeat,
	deleteSeat,
	putBooking
} = require('../models/schedule');
const { validationResult } = require('express-validator');
const moment = require('moment');
const helper = require('../helper');
const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
	console.log('Redis client connected');
});

module.exports = {
	getSchedule: async (request, response) => {
		try {
			let {
				limit,
				page,
				searcNameBus,
				searchDate,
				searchCityDeparture,
				searchCityArrival,
				searchTerminalDeparture,
				searchTerminalArrival,
				searchTimeDeparture,
				searchTimeArrival,
				sort
			} = request.query;
			page == '' || page == undefined || page == 'undefined'
				? (page = 1)
				: (page = page);
			limit == '' || limit == undefined || limit == 'undefined'
				? (limit = 8)
				: (limit = limit);
			searcNameBus == '' || searcNameBus == undefined
				? (searcNameBus = '')
				: (searcNameBus = searcNameBus);
			searchDate == '' || searchDate == undefined
				? (searchDate = '')
				: (searchDate = `AND DATE(schedule.departure_time)='${searchDate}'`);
			searchCityDeparture == '' || searchCityDeparture == undefined
				? (searchCityDeparture = '')
				: (searchCityDeparture =
						'AND schedule.departure_city=' + searchCityDeparture);
			searchCityArrival == '' || searchCityArrival == undefined
				? (searchCityArrival = '')
				: (searchCityArrival =
						'AND schedule.arrival_city=' + searchCityArrival);
			searchTerminalDeparture == '' || searchTerminalDeparture == undefined
				? (searchTerminalDeparture = '')
				: (searchTerminalDeparture =
						'AND schedule.departure_location=' + searchTerminalDeparture);
			searchTerminalArrival == '' || searchTerminalArrival == undefined
				? (searchTerminalArrival = '')
				: (searchTerminalArrival =
						'AND schedule.arrival_location=' + searchTerminalArrival);
			searchTimeDeparture == 0 || searchTimeDeparture == undefined
				? (searchTimeDeparture = '')
				: searchTimeDeparture == 1
				? (searchTimeDeparture =
						'AND TIME(schedule.departure_time) BETWEEN "00:00:00" AND "06:00:00"')
				: searchTimeDeparture == 2
				? (searchTimeDeparture =
						'AND TIME(schedule.departure_time) BETWEEN "06:00:00" AND "12:00:00"')
				: searchTimeDeparture == 3
				? (searchTimeDeparture =
						'AND TIME(schedule.departure_time) BETWEEN "12:00:00" AND "18:00:00"')
				: searchTimeDeparture == 4
				? (searchTimeDeparture =
						'AND TIME(schedule.departure_time) BETWEEN "18:00:00" AND "00:00:00"')
				: (searchTimeDeparture = '');
			searchTimeArrival == 0 || searchTimeArrival == undefined
				? (searchTimeArrival = '')
				: searchTimeArrival == 1
				? (searchTimeArrival =
						'AND TIME(schedule.arrival_time) BETWEEN "00:00:00" AND "06:00:00"')
				: searchTimeArrival == 2
				? (searchTimeArrival =
						'AND TIME(schedule.arrival_time) BETWEEN "06:00:00" AND "12:00:00"')
				: searchTimeArrival == 3
				? (searchTimeArrival =
						'AND TIME(schedule.arrival_time) BETWEEN "12:00:00" AND "18:00:00"')
				: searchTimeArrival == 4
				? (searchTimeArrival =
						'AND TIME(schedule.arrival_time) BETWEEN "18:00:00" AND "00:00:00"')
				: (searchTimeArrival = '');
			sort == '' || sort == undefined
				? (sort = 'schedule.id')
				: sort == 'departure_time'
				? (sort = 'schedule.departure_time')
				: sort == 'arrived_time'
				? (sort = 'schedule.arrived_time')
				: (sort = 'schedule.price');
			const check = await checkSeat();
			check.forEach(async item => {
				if (item.minute_diff < -30) {
					await putBooking(item.id);
					await deleteSeat(item.id);
				} else {
					console.log(`${item.minute_diff} < -30`);
				}
			});
			const skip = (page - 1) * limit;
			const total = await getPage(
				limit,
				skip,
				searcNameBus,
				searchDate,
				searchCityDeparture,
				searchCityArrival,
				searchTerminalDeparture,
				searchTerminalArrival,
				searchTimeDeparture,
				searchTimeArrival,
				sort
			);
			const { totalPage, totalItems } = total;
			const currentPage = parseInt(page);
			const createId =
				limit +
				skip +
				searcNameBus +
				searchDate +
				searchCityDeparture +
				searchCityArrival +
				searchTerminalDeparture +
				searchTerminalArrival +
				searchTimeDeparture +
				searchTimeArrival +
				sort;
			const splitId = createId.replace(/\s/g, '');
			client.get(splitId, async (err, data) => {
				if (err) throw err;
				if (data !== null) {
					const result = JSON.parse(data);
					return helper.response(response, 200, {
						result,
						limit,
						currentPage,
						totalPage,
						totalItems
					});
				} else {
					const result = await getSchedule(
						limit,
						skip,
						searcNameBus,
						searchDate,
						searchCityDeparture,
						searchCityArrival,
						searchTerminalDeparture,
						searchTerminalArrival,
						searchTimeDeparture,
						searchTimeArrival,
						sort
					);
					const results = JSON.stringify(result);
					client.setex(splitId, 3600, results);

					return helper.response(response, 200, {
						result,
						limit,
						currentPage,
						totalPage,
						totalItems
					});
				}
			});
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	getScheduleById: async (request, response) => {
		try {
			const { id } = request.params;
			client.get(`schedule${id}`, async (err, data) => {
				if (err) throw err;
				if (data !== null) {
					const result = JSON.parse(data);
					return helper.response(response, 200, result);
				} else {
					const result = await getScheduleById(id);
					if (result.length > 0) {
						const results = JSON.stringify(result);
						client.setex(`schedule${id}`, 3600, results);

						return helper.response(response, 200, result);
					} else {
						return helper.response(
							response,
							200,
							[],
							[
								{
									error: 'Data not found'
								}
							]
						);
					}
				}
			});
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	getSeat: async (request, response) => {
		try {
			const { id } = request.params;
			const seat = [];
			const result = await getScheduleById(id);
			if (result.length > 0) {
				const { total_seat } = result[0];
				const results = await getSeat(id);
				results.forEach(function(item) {
					seat.push(item);
				});
				return helper.response(response, 200, {
					total_seat: total_seat,
					seat: seat
				});
			} else {
				return helper.response(
					response,
					200,
					[],
					[
						{
							error: 'Data not found'
						}
					]
				);
			}
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
