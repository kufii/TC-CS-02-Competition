'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./lib/tcapi.js');

const port = process.env.PORT || 8080;
const router = express.Router();

// Public Routes

const handleResults = function(res, data) {
	res.status({
		[api.Messages.SUCCESS]: 200,
		[api.Messages.SUCCESSFUL_INSERT]: 201,
		[api.Messages.SUCCESSFUL_CHANGE]: 204,
		[api.Messages.BAD_ID]: 404,
		[api.Messages.INVALID]: 400
	}[data.status]).json(data.json);
};

// Get all centers
router.get('/centers', async(req, res) => handleResults(res, await api.getAllCenters()));

// Get center by id
router.get('/centers/:id', async(req, res) => handleResults(res, await api.getCenter(req.params.id)));

router.route('/appointments')
	// Get all appointments
	.get(async(req, res) => handleResults(res, await api.getAllAppointments()))
	// Add new appointment
	.post(async(req, res) => handleResults(res, await api.insertAppointment(req.body)));

router.route('/appointments/:id')
	// Get appointment by id
	.get(async(req, res) => handleResults(res, await api.getAppointment(req.params.id)))
	// update appointment
	.put(async(req, res) => handleResults(res, await api.updateAppointment(req.params.id, req.body)))
	// delete appointment
	.delete(async(req, res) => handleResults(res, await api.deleteAppointment(req.params.id)));

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
