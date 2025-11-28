import { User } from "../models/User.js";

export const userDao = {
	async findById(userId) {
		const user = await User.findOne({_id: userId });
		return user;
	} 
};