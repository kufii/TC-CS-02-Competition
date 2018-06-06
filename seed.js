// Script to reset the database to the initial state
'use strict';

require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const CenterType = require('./lib/models/center-type.js');
const Center = require('./lib/models/center.js');

mongoose.connect(process.env.DB_CONN);

// Clears the data in the DB and inserts based off the data in centers.json
const seed = async function() {
	const clearData = function() {
		console.log('Clearing Data...');
		return Promise.all([
			Center.remove(),
			CenterType.remove({})
		]);
	};

	const insertCenterTypes = function(types) {
		console.log('Adding Center Types...');
		return Promise.all(types.map(type => {
			return new CenterType({
				_id: parseInt(type.Id),
				value: type.Value
			}).save();
		}));
	};

	const insertCenters = function(centers) {
		console.log('Adding Centers...');
		return Promise.all(centers.map(center => {
			return new Center({
				_id: parseInt(center.Id),
				name: center.Name,
				street: center.StreetAddress,
				centertype: parseInt(center.CenterTypeId)
			}).save();
		}));
	};

	await clearData();

	const data = JSON.parse(fs.readFileSync('./data/centers.json'));
	await insertCenterTypes(data.CenterTypes);
	await insertCenters(data.Centers);
};

seed().then(() => mongoose.connection.close());
