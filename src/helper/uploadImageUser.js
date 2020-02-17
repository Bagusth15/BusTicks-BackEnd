const multer = require('multer');
const randomNumber = 6;
const randomNumbers = Math.floor(
	Math.pow(10, randomNumber - 1) +
		Math.random() * 9 * Math.pow(10, randomNumber - 1)
);

const storage = multer.diskStorage({
	destination: (request, file, callback) => {
		callback(null, './uploads/userProfile');
	},
	filename: (request, file, callback) => {
		callback(null, randomNumbers + file.originalname);
	}
});
const fileFilter = (request, file, callback) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		callback(null, true);
	} else {
		callback(new Error('Extension File Must be PNG or JPG'), false);
	}
};
let upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 }
});

upload = upload.single('image');

module.exports = upload;
