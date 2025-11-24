import mongoose from "mongoose";

const OWNERID = {
	type: String,
	required: true,
};

const NAME = {
	type: String,
	required: true
};

const ID = {
	type: String,
	required: true
};

const MEMBERLIST = {
	type: Array,
	required: true
};

const ITEMLIST = {
	type: Array,
	required: true
};

const ISARCHIVED = {
	type: Boolean,
	required: true
};

const create = new mongoose.Schema({
	ownerId: OWNERID,
	name: NAME,
});

const ShoppingList = mongoose.model('ShoppingList', create);

export {
	ShoppingList
}