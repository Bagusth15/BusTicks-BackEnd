const { check } = require('express-validator');

exports.register = [
	check('name')
		.notEmpty()
		.withMessage('Name Cannot be Empty')
		.isLength({ min: 3 })
		.withMessage('Min Length 5 Character'),
	check('email')
		.notEmpty()
		.withMessage('Email Cannot be Empty')
		.isEmail()
		.withMessage('Invalid Email'),
	check('username')
		.notEmpty()
		.withMessage('Username Cannot be Empty')
		.isLength({ min: 3 })
		.withMessage('Min Length 5 Character'),
	check('password')
		.notEmpty()
		.withMessage('Password Cannot be Empty')
		.isLength({ min: 6 })
		.withMessage('Min Length 6 Character'),
	check('confirm_password')
		.notEmpty()
		.withMessage('Confirm Password Cannot be Empty')
		.isLength({ min: 6 })
		.withMessage('Min Length 6 Character')
];
exports.login = [
	check('username')
		.notEmpty()
		.withMessage('Username Cannot be Empty'),
	check('password')
		.notEmpty()
		.withMessage('Password Cannot be Empty')
];
exports.forgot = [
	check('email')
		.notEmpty()
		.withMessage('Email Cannot be Empty')
		.isEmail()
		.withMessage('Invalid Email')
];
exports.resetpassword = [
	check('password')
		.notEmpty()
		.withMessage('Password Cannot be Empty')
		.isLength({ min: 6 })
		.withMessage('Min Length 6 Character'),
	check('confirm_password')
		.notEmpty()
		.withMessage('Confirm Password Cannot be Empty')
];
exports.updatepassword = [
	check('old_password')
		.notEmpty()
		.withMessage('Confirm Password Cannot be Empty'),
	check('new_password')
		.notEmpty()
		.withMessage('Password Cannot be Empty')
		.isLength({ min: 6 })
		.withMessage('Min Length 6 Character'),
	check('confirm_password')
		.notEmpty()
		.withMessage('Confirm Password Cannot be Empty')
];
exports.updateProfile = [
	check('name')
		.notEmpty()
		.withMessage('Name Cannot be Empty')
		.isLength({ min: 3 })
		.withMessage('Min Length 5 Character'),
	check('email')
		.notEmpty()
		.withMessage('Email Cannot be Empty')
		.isEmail()
		.withMessage('Invalid Email'),
	check('username')
		.notEmpty()
		.withMessage('Username Cannot be Empty')
		.isLength({ min: 3 })
		.withMessage('Min Length 5 Character')
];
