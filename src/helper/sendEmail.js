const nodemailer = require('nodemailer');

module.exports = {
	forgot: async (email, userKeys) => {
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: 'memo.in.aja@gmail.com', // generated ethereal user
				pass: 'Memo050798' // generated ethereal password
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
