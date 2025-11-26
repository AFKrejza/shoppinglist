import mongoose from "mongoose";

export const ItemSchema = new mongoose.Schema({
	// _id: {
	// 	type: String,
	// 	// required: true
	// },
	name: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		default: 1
	},
	unit: {
		type: String,
		default: ""
	},
	ticked: {
		type: Boolean,
		default: false
	},
}, { _id: true });

export const Item = mongoose.model('Item', ItemSchema);