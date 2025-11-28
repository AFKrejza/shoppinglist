import { userDao } from "../dao/userDao.js";

// basically an enumeration
export const ROLES = {
	USER: 0,
	ADMIN: 1,
	SUPERADMIN: 2,
};

export function authRole(minRole) {
	return async function(req, res, next) {
		const user = await userDao.findById({_id: req.user.id });
		if (ROLES[user.role] < minRole) {
			console.log("Forbidden");
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	}
}
