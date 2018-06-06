'use strict';

const mongoose = require('mongoose');
const CenterType = require('./models/center-type.js');
const Center = require('./models/center.js');
const Appointment = require('./models/appointment.js');

mongoose.connect(process.env.DB_CONN);

const cache = {};

const Util = {
	async parseCenter(center) {
		const [centerType] = (await api.getCenterTypes())
			.filter(type => type._id === center.centertype);
		return {
			Id: center._id,
			Name: center.name,
			StreetAddress: center.street,
			CenterTypeValue: centerType.value
		};
	},
	async parseAppointment(appt) {
		const center = (await api.getCenter(appt.center)) || { Id: appt.center };

		return {
			Id: appt._id,
			ClientFullName: appt.client,
			Date: appt.date,
			Center: center
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

		const centers = await Center.find();
		cache.centers = await Promise.all(centers.map(Util.parseCenter));

		return cache.centers;
	},
	async getCenter(id) {
		const centers = (await api.getAllCenters())
			.filter(center => center.Id === parseInt(id));

		if (centers.length > 0) {
			return centers[0];
		}
		return null;
	},
	async getAllAppointments() {
		const appts = await Appointment.find();
		return Promise.all(appts.map(Util.parseAppointment));
	},
	async getAppointment(id) {
		const appt = await Appointment.findById(id);
		if (appt) {
			return Util.parseAppointment(appt);
		}
		return null;
	},
	async insertAppointment(appt) {
		return Util.parseAppointment(await new Appointment({
			client: appt.ClientFullName,
			date: new Date(appt.Date),
			center: parseInt(appt.CenterId)
		}).save());
	}
};
module.exports = api;
