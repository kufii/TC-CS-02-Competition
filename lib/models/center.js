'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('Center', new mongoose.Schema({
	_id: Number,
	name: String,
	street: String,
	centertype: { type: Number, ref: 'CenterType' }
}));
