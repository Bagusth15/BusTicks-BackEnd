const connection = require('../config/mysql');

module.exports = {
	getSeat: idSchedule => {
		return new Promise((resolve, reject) => {
			connection.query(
				'SELECT bus.name, bus.total_seat, bus.format_seat, schedule.departure_location, schedule.departure_time, schedule.arrival_location, schedule.arrival_time, schedule.price FROM schedule JOIN bus ON schedule.id_bus = bus.id WHERE schedule.id = ?',
				idSchedule,
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
	// checkById: id => {
	// 	return new Promise((resolve, reject) => {
	// 		connection.query(
	// 			'SELECT id, username, email, password, image FROM user WHERE id = ?',
	// 			id,
	// 			(error, result) => {
	// 				if (!error) {
	// 					resolve(result);
	// 				} else {
	// 					reject(new Error(error));
	// 				}
	// 			}
	// 		);
	// 	});
	// }
};
