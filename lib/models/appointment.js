'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('Appointment', new mongoose.Schema({
	_id: Number,
	client: String,
	date: Date,
	center: Number
}));
