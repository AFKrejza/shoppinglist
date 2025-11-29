import { userDao } from "../dao/userDao.js";
import { ROLES } from "../config/roles.js";

export async function roleService(userId, minRole) {
	const user = await userDao.findById({_id: userId });
	if (ROLES[user.role] < minRole)
		return false;

	return true;
}

export async function getRole(userId) {
	const user = await userDao.findById({ _id: userId });
	return user.role;
}