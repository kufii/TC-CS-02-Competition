'use strict';

const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
	_id: Number,
	name: String,
	street: String,
	centertype: Number
});

module.exports = mongoose.model('Center', centerSchema);
