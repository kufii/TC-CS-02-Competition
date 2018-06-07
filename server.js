'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./lib/tcapi.js');

const port = process.env.PORT || 8080;
const router = express.Router();

// Public Routes

// Get all centers
router.get('/centers', async(req, res) => res.json(await api.getAllCenters()));

// Get center by id
router.get('/centers/:id', async(req, res) => {
	const data = await api.getCenter(req.params.id);
	if (data) {
		res.json(data);
	} else {
		res.status(404).send('Not found');
	}
});

router.route('/appointments')
	// Get all appointments
	.get(async(req, res) => res.json(await api.getAllAppointments()))
	// Add new appointment
	.post(async(req, res) => {
		const data = await api.insertAppointment(req.body);
		if (data) {
			res.status(201).json(data);
		} else {
			res.status(400).send('Request was badly formatted');
		}
	});

router.route('/appointments/:id')
	// Get appointment by id
	.get(async(req, res) => {
		const data = await api.getAppointment(req.params.id);
		if (data) {
			res.json(data);
		} else {
			res.status(404).send('Not found');
		}
	})
	// update appointment
	.put(async(req, res) => {
		const data = await api.updateAppointment(req.params.id, req.body);
		if (data) {
			res.status(204).send('Successful update');
		} else {
			res.status(400).send('Request was badly formatted');
		}
	})
	// delete appointment
	.delete(async(req, res) => {
		if ((await api.deleteAppointment(req.params.id)).n > 0) {
			res.status(204).send('Successful delete');
		} else {
			res.status(404).send('Not found');
		}
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
