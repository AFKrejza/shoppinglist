import mongoose from "mongoose";

export const ItemSchema = new mongoose.Schema({
	_id: {
		type: String,
		// required: true
	},
	name: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		required: true,
		default: 1
	},
	unit: {
		type: String,
		required: true,
		default: ""
	},
	ticked: {
		type: Boolean,
		default: false
	},
});

export const Item = mongoose.model('Item', ItemSchema);