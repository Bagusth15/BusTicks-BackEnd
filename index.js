const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routerNavigation = require('./src');
const morgan = require('morgan');
const cors = require('cors');
const PORT = '127.0.0.1' || 3001;
// const redis = require('redis');
// const client = redis.createClient();

// client.on('connect', function() {
// 	console.log('Redis client connected');
// });

app.use(cors());
app.listen(3001, '127.0.0.1', () => {
	console.log(`Listening on ${PORT}:3001`);
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
