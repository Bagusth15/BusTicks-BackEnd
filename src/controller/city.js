const { getCity, getCityById } = require('../models/city');
const helper = require('../helper');
const redis = require('redis');
const client = redis.createClient();

module.exports = {
	getCity: async (request, response) => {
		try {
			const result = await getCity();
			return helper.response(response, 200, result);
		} catch (error) {
			return helper.response(response, 400, error);
		}
	},
	getCityById: async (request, response) => {
		try {
			const { id } = request.params;
			client.get(`city${id}`, async (err, data) => {
				if (err) throw err;
				if (data !== null) {
					const result = JSON.parse(data);
					return helper.response(response, 200, result);
				} else {
					const result = await getCityById(id);
					if (result.length > 0) {
						const results = JSON.stringify(result);
						client.setex(`city${id}`, 3600, results);
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
