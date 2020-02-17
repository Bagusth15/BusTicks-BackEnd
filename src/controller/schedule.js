const { getPage, getSchedule, getScheduleById } = require('../models/schedule');
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
						'AND schedule.departure_time BETWEEN "00:00:00" AND "06:00:00"')
				: searchTimeDeparture == 2
				? (searchTimeDeparture =
						'AND schedule.departure_time BETWEEN "06:00:00" AND "12:00:00"')
				: searchTimeDeparture == 3
				? (searchTimeDeparture =
						'AND schedule.departure_time BETWEEN "12:00:00" AND "18:00:00"')
				: searchTimeDeparture == 4
				? (searchTimeDeparture =
						'AND schedule.departure_time BETWEEN "18:00:00" AND "00:00:00"')
				: (searchTimeDeparture = '');
			searchTimeArrival == 0 || searchTimeArrival == undefined
				? (searchTimeArrival = '')
				: searchTimeArrival == 1
				? (searchTimeArrival =
						'AND schedule.departure_time BETWEEN "00:00:00" AND "06:00:00"')
				: searchTimeArrival == 2
				? (searchTimeArrival =
						'AND schedule.departure_time BETWEEN "06:00:00" AND "12:00:00"')
				: searchTimeArrival == 3
				? (searchTimeArrival =
						'AND schedule.departure_time BETWEEN "12:00:00" AND "18:00:00"')
				: searchTimeArrival == 4
				? (searchTimeArrival =
						'AND schedule.departure_time BETWEEN "18:00:00" AND "00:00:00"')
				: (searchTimeArrival = '');
			sort == '' || sort == undefined
				? (sort = 'schedule.id')
				: sort == 'departure_time'
				? (sort = 'schedule.departure_time')
				: sort == 'arrived_time'
				? (sort = 'schedule.arrived_time')
				: (sort = 'schedule.price');

			const skip = (page - 1) * limit;
			const total = await getPage(limit);
			const { totalPage, totalItems } = total;
			const currentPage = parseInt(page);
			const createId =
				limit +
				skip +
				searcNameBus +
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
						return helper.response(response, 200, [], {
							data: 'Data not found'
						});
					}
				}
			});
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
};
