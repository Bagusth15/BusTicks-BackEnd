const connection = require('../config/mysql');

module.exports = {
	getPage: limit => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT count(*) as numRows FROM schedule',
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
		searchTerminalDeparture,
		searchTerminalArrival,
		searchTimeDeparture,
		searchTimeArrival,
		sort
	) => {
		return new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE bus.name LIKE '%${searcNameBus}%' ${searchTerminalDeparture} ${searchTerminalArrival} ${searchTimeDeparture} ${searchTimeArrival} ORDER BY ${sort} ASC LIMIT ${limit} OFFSET ${skip}`,
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
				`SELECT * FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE schedule.id=${id}`,
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
