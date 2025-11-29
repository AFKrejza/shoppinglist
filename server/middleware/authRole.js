import { userDao } from "../dao/userDao.js";
import { ROLES } from "../config/roles.js";

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
