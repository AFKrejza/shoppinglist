// check db/models for base schemas
import mongoose from "mongoose";

const ID = {
	type: Number,
	required: true
};

const USERNAME = {
	type: String,
	required: true
};

const EMAIL = {
	type: String,
	required: true,
	trim: true,
	unique: true,
	lowercase: true
};

const PASSWORD = {
	type: String,
	required: true,
};



const authenticateIn = new mongoose.Schema({
	email: EMAIL,
	password: PASSWORD
});

const updateIn = new mongoose.Schema({
	id: ID,
	userName: USERNAME,
	email: EMAIL
});

const createIn = new mongoose.Schema({
	userName: USERNAME,
	email: EMAIL,
});

const getIn = new mongoose.Schema({
	id: ID
});

const deleteIn = new mongoose.Schema({
	id: ID
});



const authenticateOut = new mongoose.Schema({
	// also returns a JWT
	id: ID,
	userName: USERNAME,
	email: EMAIL
});

const createOut = new mongoose.Schema({
	// also returns a JWT since it logs the user in
	id: ID,
	userName: USERNAME,
	email: EMAIL
});

const getOut = new mongoose.Schema({
	id: ID,
	userName: USERNAME,
	email: EMAIL
});

const updateOut = new mongoose.Schema({
	id: ID,
	userName: USERNAME,
	email: EMAIL
});

const deleteOut = new mongoose.Schema({
});

export default {
	authenticateIn,
	createIn,
	getIn,
	updateIn,
	deleteIn,
	authenticateOut,
	createOut,
	getOut,
	updateOut,
	deleteOut
}