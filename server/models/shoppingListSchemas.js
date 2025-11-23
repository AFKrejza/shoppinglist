import mongoose from "mongoose";

// check db/models for base schemas

const OWNERID = {
	type: Number,
	required: true,
};

const NAME = {
	type: String,
	required: true
};

const ID = {
	type: Number,
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



const createIn = new mongoose.Schema({
	ownerId: OWNERID,
	name: NAME,
});

const getIn = new mongoose.Schema({
	id: ID
});

const updateIn = new mongoose.Schema({
	id: ID,
	ownerId: OWNERID,
	name: NAME,
	memberList: MEMBERLIST,
	itemList: ITEMLIST,
	isArchived: ISARCHIVED,
});

const deleteIn = new mongoose.Schema({
	id: ID
});



const createOut = {
	id: ID,
	ownerId: OWNERID,
	name: NAME,
	memberList: MEMBERLIST,
	itemList: ITEMLIST,
	isArchived: ISARCHIVED,
};

const getOut = {
	id: ID,
	ownerId: OWNERID,
	name: NAME,
	memberList: MEMBERLIST,
	itemList: ITEMLIST,
	isArchived: ISARCHIVED,
};

const updateOut = {
	id: ID,
	ownerId: OWNERID,
	name: NAME,
	memberList: MEMBERLIST,
	itemList: ITEMLIST,
	isArchived: ISARCHIVED,
};

// using findOneAndDelete
// to return the deleted list
const deleteOut = {
	id: ID,
	ownerId: OWNERID,
	name: NAME,
	memberList: MEMBERLIST,
	itemList: ITEMLIST,
	isArchived: ISARCHIVED,
};

export default {
	createIn,
	getIn,
	updateIn,
	deleteIn,
	createOut,
	getOut,
	updateOut,
	deleteOut
}