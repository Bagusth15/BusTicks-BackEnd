const {
	getTerminal,
	getTerminalById,
	getTerminalByCity
} = require('../models/terminal');
const helper = require('../helper');
const redis = require('redis');
const client = redis.createClient();

module.exports = {
	getTerminal: async (request, response) => {
		try {
			const result = await getTerminal();
			return helper.response(response, 200, result);
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	getTerminalById: async (request, response) => {
		try {
			const { id } = request.params;
			client.get(`terminal${id}`, async (err, data) => {
				if (err) throw err;
				if (data !== null) {
					const result = JSON.parse(data);
					return helper.response(response, 200, result);
				} else {
					const result = await getTerminalById(id);
					if (result.length > 0) {
						const results = JSON.stringify(result);
						client.setex(`terminal${id}`, 3600, results);
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
	getTerminalByCity: async (request, response) => {
		try {
			const { idCity } = request.params;
			client.get(`terminalCity${idCity}`, async (err, data) => {
				if (err) throw err;
				if (data !== null) {
					const result = JSON.parse(data);
					return helper.response(response, 200, result);
				} else {
					const result = await getTerminalByCity(idCity);
					if (result.length > 0) {
						const results = JSON.stringify(result);
						client.setex(`terminalCity${idCity}`, 3600, results);
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
	}
};
