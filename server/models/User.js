import mongoose from "mongoose";

const ID = {
	type: String,
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

const create = new mongoose.Schema({
	userName: USERNAME,
	email: EMAIL,
	password: PASSWORD
});

const User = mongoose.model('User', create);

export {
	User
}