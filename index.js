require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routerNavigation = require('./src');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.listen(process.env.APP_PORT, process.env.DB_PORT, () => {
	console.log(
		'Listening on ' + process.env.DB_PORT + ':' + process.env.APP_PORT
	);
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // untuk menampilkan aktivitas client
app.use(express.static('uploads/userProfile'));
app.use(express.static('uploads/bus'));
app.use('/', routerNavigation);
