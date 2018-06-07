'use strict';

const mongoose = require('mongoose');
const IdValidator = require('mongoose-id-validator');

const schema = new mongoose.Schema({
	_id: Number,
	name: String,
	street: String,
	centertype: {
		type: Number,
		ref: 'CenterType',
		required: true
	}
});
schema.plugin(IdValidator);

module.exports = mongoose.model('Center', schema);
