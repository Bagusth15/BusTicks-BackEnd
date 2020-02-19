const connection = require('../config/mysql');

module.exports = {
	getPage: (
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
	) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT count(*) as numRows FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE bus.name LIKE '%${searcNameBus}%' ${searchDate} ${searchCityDeparture} ${searchCityArrival} ${searchTerminalDeparture} ${searchTerminalArrival} ${searchTimeDeparture} ${searchTimeArrival} ORDER BY ${sort} ASC LIMIT ${limit} OFFSET ${skip}`,
				(error, result) => {
					const numRows = result[0].numRows;
					const numPages = Math.ceil(numRows / limit);
					if (!error) {
						const newResult = {
							totalItems: numRows,
							totalPage: numPages
						};
						resolve(newResult);
					} else {
						reject(new Error(error));
					}
				}
			);
		});
	},
	getSchedule: (
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
	) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT schedule.id, bus.name, bus.total_seat, bus.format_seat, schedule.departure_location, schedule.departure_time, schedule.arrival_location, schedule.arrival_time, schedule.price FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE bus.name LIKE '%${searcNameBus}%' ${searchDate} ${searchCityDeparture} ${searchCityArrival} ${searchTerminalDeparture} ${searchTerminalArrival} ${searchTimeDeparture} ${searchTimeArrival} ORDER BY ${sort} ASC LIMIT ${limit} OFFSET ${skip}`,
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
	getScheduleById: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT schedule.id, bus.name, bus.total_seat, bus.format_seat, schedule.departure_location, schedule.departure_time, schedule.arrival_location, schedule.arrival_time, schedule.price, schedule.create_at, schedule.update_at  FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE schedule.id=${id}`,
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
	getSeat: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT seat as id FROM bookingdetail WHERE id_schedule=${id}`,
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
	checkSeat: () => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT id, TIMESTAMPDIFF(MINUTE, NOW(), create_at) AS minute_diff FROM booking WHERE payment_status = 'pending'`,
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
	putBooking: id => {
		return new Promise((resolve, reject) => {
			connection.query(
				`UPDATE booking SET payment_status='expired', payment_link='' WHERE id=${id}`,
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
