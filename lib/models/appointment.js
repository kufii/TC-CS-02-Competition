'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schema = new mongoose.Schema({
	_id: Number,
	client: String,
	date: Date,
	center: Number
}, { _id: false });
schema.plugin(AutoIncrement, { id: 'apptcounter' });

module.exports = mongoose.model('Appointment', schema);
