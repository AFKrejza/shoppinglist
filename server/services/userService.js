import { userDao } from "../dao/userDao.js";
import { hashPassword } from "./hashService.js";
import { ROLES } from "../config/roles.js";
import { roleService, getRole, roleCompare } from "./roleService.js";


export const userService = {

	async findById(userId) {
		const user = await userDao.findById(userId);
		return user;
	},

	async update(targetId, userId, data) {
		const user = await userDao.findById(targetId);
		if (!user)
			throw new Error("User not found");

		if (user._id !== userId && roleCompare(userId, targetId) <= 0) {
			throw new Error("Missing privileges");
		}

		const userRole = await getRole(userId);
		console.log(userRole);
		const targetRole = await getRole(targetId);
		if (ROLES[data.role] >= ROLES[userRole] || ROLES[targetRole] >= ROLES[userRole]) {
			throw new Error("Missing privileges: cannot assign greater privileges");
		}
		if (data.role === "SUPERADMIN")
			throw new Error("Cannot reassign superadmin role");

		const updates = {};

		if (data.userName !== undefined)
			updates.userName = data.userName;
		if (data.password !== undefined)
			updates.password = await hashPassword(data.password);
		if (data.email !== undefined) // must be unique
			updates.email = data.email;

		await userDao.update(targetId, updates);
	},
	
	async remove(targetId, userId) {

		if (targetId !== userId && roleCompare(userId, targetId) <= 0) {
			throw new Error("Missing privileges");
		}
		const deleteMsg = await userDao.remove(targetId);
		return deleteMsg;
	}
};