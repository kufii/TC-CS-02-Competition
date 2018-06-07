'use strict';

const mongoose = require('mongoose');
const CenterType = require('./models/center-type.js');
const Center = require('./models/center.js');
const Appointment = require('./models/appointment.js');

mongoose.connect(process.env.DB_CONN);

const Util = {
	parseCenter(center) {
		if (!center) return null;
		return {
			Id: center._id,
			Name: center.name,
			StreetAddress: center.street,
			CenterTypeValue: center.centertype.value
		};
	},
	parseAppointment(appt) {
		if (!appt) return null;
		return {
			Id: appt._id,
			ClientFullName: appt.client,
			Date: appt.date,
			Center: typeof appt.center === 'number' ? appt.center : Util.parseCenter(appt.center)
		};
	},
	async validateModel(model) {
		try {
			await model.validate();
			return true;
		} catch (e) {
			return false;
		}
	}
};

const api = {
	async getAllCenters() {
		return (await Center.find().populate('centertype')).map(Util.parseCenter);
	},
	async getCenter(id) {
		return Util.parseCenter(await Center.findById(id).populate('centertype'));
	},
	async getAllAppointments() {
		return (await Appointment.find().populate({
			path: 'center',
			populate: {
				path: 'centertype',
				model: CenterType
			}
		})).map(Util.parseAppointment);
	},
	async getAppointment(id) {
		return Util.parseAppointment(await Appointment.findById(id).populate({
			path: 'center',
			populate: {
				path: 'centertype',
				model: CenterType
			}
		}));
	},
	async insertAppointment(appt) {
		const appointment = new Appointment({
			client: appt.ClientFullName,
			date: new Date(appt.Date),
			center: parseInt(appt.CenterId)
		});

		if (!await Util.validateModel(appointment)) return null;

		return Util.parseAppointment(await appointment.save());
	},
	async updateAppointment(id, appt) {
		const appointment = await Appointment.findById(id);
		if (!appointment) return null;

		appointment.set({
			client: appt.ClientFullName,
			date: new Date(appt.Date),
			center: parseInt(appt.CenterId)
		});

		if (!await Util.validateModel(appointment)) return null;

		return appointment.save();
	},
	deleteAppointment(id) {
		return Appointment.remove({ _id: id });
	}
};
module.exports = api;
