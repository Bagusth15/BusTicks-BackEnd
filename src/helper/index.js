module.exports = {
	response: (response, status, data, msg, pagination) => {
		const result = {};
		result.status = status || 200;
		result.data = data;
		result.msg = msg;

		return response.status(result.status).json(result);
	}
};
