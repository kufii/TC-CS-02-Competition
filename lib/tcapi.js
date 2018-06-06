'use strict';

const mongoose = require('mongoose');
const CenterType = require('./models/center-type.js');
const Center = require('./models/center.js');

mongoose.connect(process.env.DB_CONN);

const cache = {};

const Util = {
	parseCenter(center, centerTypes) {
		return {
			Id: center._id,
			Name: center.name,
			StreetAddress: center.street,
			CenterTypeValue: centerTypes.filter(type => {
				return type._id === center.centertype;
			})[0].value
		};
	}
};

const api = {
	async getCenterTypes() {
		if (cache.centerTypes) return cache.centerTypes;

		cache.centerTypes = await CenterType.find();
		return cache.centerTypes;
	},
	async getAllCenters() {
		if (cache.centers) return cache.centers;

		const centerTypes = await api.getCenterTypes();
		cache.centers = (await Center.find())
			.map(center => Util.parseCenter(center, centerTypes));

		return cache.centers;
	},
	async getCenter(id) {
		const centerTypes = await api.getCenterTypes();
		return Util.parseCenter(await Center.findById(id), centerTypes);
	}
};
module.exports = api;
