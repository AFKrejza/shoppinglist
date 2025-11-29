import { User } from "../models/User.js";

export const userDao = {
	async findById(userId) {
		const user = await User.findOne({_id: userId }, { password: 0 }).lean();
		return user;
	},

	async update(userId, updates) {
		return await User.findByIdAndUpdate(
			userId,
			{ $set: updates },
			{ runValidators: true }
		);
	},

	async remove(userId) {
		return await User.deleteOne({ _id: userId });
	}

};