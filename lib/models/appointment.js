'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const IdValidator = require('mongoose-id-validator');

const schema = new mongoose.Schema({
	_id: Number,
	client: String,
	date: Date,
	center: {
		type: Number,
		ref: 'Center',
		required: true
	}
}, { _id: false });
schema.plugin(AutoIncrement, { id: 'apptcounter' });
schema.plugin(IdValidator);

module.exports = mongoose.model('Appointment', schema);
