const nodemailer = require('nodemailer');

module.exports = {
	forgot: async (email, userKeys) => {
		let transporter = nodemailer.createTransport({
			host: process.env.HOST_EMAIL,
			port: process.env.PORT_EMAIL,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.USER_EMAIL, // generated ethereal user
				pass: process.env.USER_PASSWORD // generated ethereal password
			}
		});
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"BusTicks"', // sender address
			to: email, // list of receivers
			subject: 'BusTicks - Forgot Password', // Subject line
			html: `<b>Please input the code for reset password : </b> ${userKeys}` // html body
		});
	}
};
