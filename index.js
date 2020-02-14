const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routerNavigation = require('./src');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

app.listen(3001, '127.0.0.1', () => {
	console.log('Listening on 127.0.0.1:3001');
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
app.use('/', routerNavigation);
