const express = require('express');
const Route = express.Router();
const validator = require('../validator');
const upload = require('../helper/uploadImageUser');
const helper = require('../helper');
const multer = require('multer');

const {
	updateProfileUser,
	updatePasswordUser,
	detailUser
} = require('../controller/user');

uploadFile = (request, response, next) => {
	upload(request, response, err => {
		if (err instanceof multer.MulterError) {
			return helper.response(
				response,
				200,
				[],
				[
					{
						error: 'Extension File Must be PNG or JPG & File Size Max 5 mb'
					}
				]
			);
		} else if (err) {
			return helper.response(
				response,
				200,
				[],
				[
					{
						error: 'Extension File Must be PNG or JPG & File Size Max 5 mb'
					}
				]
			);
		}
		next();
	});
};

Route.get('/:id', detailUser);
Route.put(
	'/update/profile/:id',
	uploadFile,
	validator.updateProfile,
	updateProfileUser
);
Route.put('/update/password/:id', validator.updatepassword, updatePasswordUser);

module.exports = Route;
