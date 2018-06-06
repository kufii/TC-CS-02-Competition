'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('CenterType', new mongoose.Schema({
	_id: Number,
	value: String
}));
