import mongoose from "mongoose";

const create = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	quantity: {
		type: String,
		required: true
	},
	unit: {
		type: String,
		required: true
	},
	ticked: {
		type: Boolean,
		required: true
	},
});
const Item = mongoose.model('Item', create);

export {
	Item
}