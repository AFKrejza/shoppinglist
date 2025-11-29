import { userDao } from "../dao/userDao.js";
import { hashPassword } from "./hashService.js";
import { ROLES } from "../config/roles.js";
import { roleService, getRole } from "./roleService.js";

export const userService = {

	async findById(userId) {
		const user = await userDao.findById(userId);
		return user;
	},

	async update(targetId, userId, data) {
		const user = await userDao.findById(targetId);
		if (!user)
			throw new Error("User not found");

		const userRole = await getRole(userId);
		const targetRole = await getRole(targetId);
		if (user._id !== userId && ROLES[userRole] < ROLES[targetRole]) {
			throw new Error("Missing privileges");
		}

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
		const userRole = await getRole(userId);
		console.log(userRole);
		
		const target = await userDao.findById(targetId);

		// if (ROLES[userId] === ROLES.ADMIN && ROLES[target.role] < ROLES[]) {
		// 	if (ROLES[target.role] <=)
		// }

		if (ROLES[target.role] >= ROLES[user.role])
			throw new Error("Missing privileges");

		if (targetId !== userId && !(await roleService(userId, ROLES.ADMIN)))
			throw new Error("Missing privileges");

		const deleteMsg = await userDao.remove(targetId);
		return deleteMsg;
	}
};