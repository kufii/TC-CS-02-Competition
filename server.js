'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./lib/tcapi.js');

const port = process.env.PORT || 8080;
const router = express.Router();

// Public Routes

// Get all centers
router.get('/centers', (req, res) => {
	api.getAllCenters().then(data => res.json(data));
});

// Get center by id
router.get('/centers/:id', (req, res) => {
	api.getCenter(req.params.id).then(data => res.json(data));
});

// Create Server
const app = express();
app.use(bodyParser.json());
app.use('/api', router);

// handle errors
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

// start server
app.listen(port);

console.log(`Starting TC Centers API on port ${port}`);
