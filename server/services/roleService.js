import { userDao } from "../dao/userDao.js";
import { ROLES } from "../config/roles.js";

export async function roleService(userId, minRole) {
	const user = await userDao.findById({_id: userId });
	// console.log(user);
	if (ROLES[user.role] < minRole)
		return false;

	return true;
}

export async function getRole(userId) {
	const user = await userDao.findById({ _id: userId });
	return user.role;
}

// this just checks if the first user has higher privileges than the second
// works like strcmp
export async function roleCompare(firstId, secondId) {
	const first = await getRole(firstId);
	const second = await getRole(secondId);

	return ROLES[first] - ROLES[second];
}