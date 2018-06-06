'use strict';

const mongoose = require('mongoose');

const centerTypeSchema = new mongoose.Schema({
	_id: Number,
	value: String
});

module.exports = mongoose.model('CenterType', centerTypeSchema);
