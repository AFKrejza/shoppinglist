// check db/models for base schemas

// shoppingList
const createIn = {
	ownerId: Number,
	name: String,
};

const createOut = {
	id: Number,
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
};

const getIn = {
	id: Number
};

const getOut = {
	id: Number,
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
};

const updateIn = {
	id: Number,
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
};

const updateOut = {
	id: Number,
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
};

const deleteIn = {
	id: Number
};

// using findOneAndDelete
// to return the deleted list
const deleteOut = {
	id: Number,
	ownerId: Number,
	name: String,
	memberList: Array,
	itemList: Array,
	isArchived: Boolean,
};

export default {
	createIn,
	createOut,
	getIn,
	getOut,
	updateIn,
	updateOut,
	deleteIn,
	deleteOut
}