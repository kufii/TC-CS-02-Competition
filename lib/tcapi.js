'use strict';

const mongoose = require('mongoose');
const CenterType = require('./models/center-type.js');
const Center = require('./models/center.js');
const Appointment = require('./models/appointment.js');

mongoose.connect(process.env.DB_CONN);

const Util = {
	parseCenter(center) {
		return {
			Id: center._id,
			Name: center.name,
			StreetAddress: center.street,
			CenterTypeValue: center.centertype.value
		};
	},
	parseAppointment(appt) {
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
	},
	processEnum(name, args) {
		const obj = {};
		args.forEach(a => obj[a] = `${name}.${a}`);
		return Object.freeze(obj);
	}
};

const api = {
	Messages: Util.processEnum('Messages', [
		'SUCCESS',
		'SUCCESSFUL_INSERT',
		'SUCCESSFUL_CHANGE',
		'BAD_ID',
		'INVALID'
	]),
	async getAllCenters() {
		return {
			status: api.Messages.SUCCESS,
			json: (await Center.find().populate('centertype')).map(Util.parseCenter)
		};
	},
	async getCenter(id) {
		const center = await Center.findById(id).populate('centertype');
		if (!center) return { status: api.Messages.BAD_ID };
		return {
			status: api.Messages.SUCCESS,
			json: Util.parseCenter(center)
		};
	},
	async getAllAppointments() {
		return {
			status: api.Messages.SUCCESS,
			json: (await Appointment.find().populate({
				path: 'center',
				populate: {
					path: 'centertype',
					model: CenterType
				}
			})).map(Util.parseAppointment)
		};
	},
	async getAppointment(id) {
		const appt = await Appointment.findById(id).populate({
			path: 'center',
			populate: {
				path: 'centertype',
				model: CenterType
			}
		});
		if (!appt) return { status: api.Messages.BAD_ID };
		return {
			status: api.Messages.SUCCESS,
			json: Util.parseAppointment(appt)
		};
	},
	async insertAppointment(appt) {
		const appointment = new Appointment({
			client: appt.ClientFullName,
			date: new Date(appt.Date),
			center: parseInt(appt.CenterId)
		});

		if (!await Util.validateModel(appointment)) return { status: api.Messages.INVALID };

		return {
			status: api.Messages.SUCCESSFUL_INSERT,
			json: Util.parseAppointment(await appointment.save())
		};
	},
	async updateAppointment(id, appt) {
		const appointment = await Appointment.findById(id);
		if (!appointment) return { status: api.Messages.BAD_ID };

		appointment.set({
			client: appt.ClientFullName,
			date: new Date(appt.Date),
			center: parseInt(appt.CenterId)
		});

		if (!await Util.validateModel(appointment)) return { status: api.Messages.INVALID };

		await appointment.save();
		return { status: api.Messages.SUCCESSFUL_CHANGE };
	},
	async deleteAppointment(id) {
		const result = await Appointment.remove({ _id: id });
		return {
			status: result.n > 0 ? api.Messages.SUCCESSFUL_CHANGE : api.Messages.BAD_ID
		};
	}
};
module.exports = api;
