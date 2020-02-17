const { getCity } = require('../models/city');
const helper = require('../helper');

module.exports = {
	getCity: async (request, response) => {
		try {
			const result = await getCity();
			return helper.response(response, 200, result);
		} catch (error) {
			return helper.response(response, 400, error);
		}
	}
	// detailUser: async (request, response) => {
	// 	try {
	// 		const { id } = request.params;
	// 		const result = await checkById(id);
	// 		if (result.length > 0) {
	// 			return helper.response(response, 200, result);
	// 		} else {
	// 			return helper.response(response, 200, [], { data: 'Data not found' });
	// 		}
	// 	} catch (error) {
	// 		return helper.response(response, 400, error);
	// 	}
	// }
};
