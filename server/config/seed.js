import { User } from "../models/User.js";
import { ROLES } from "./roles.js";
import { hashPassword } from "../services/hashService.js";

// this should run on each server start
// since I regularly wipe the db and 
// want the same data on my other computer
export async function setSuperAdmin() {
	try {
		const superEmail = process.env.SUPERADMIN_EMAIL;
		const superPassword = process.env.SUPERADMIN_PASSWORD;
	
		const existingSuper = await User.findOne({ email: superEmail });
		if (existingSuper) return;
	
		const superAdmin = new User({
			userName: "superadmin",
			email: superEmail,
			password: await hashPassword(superPassword),
			role: "SUPERADMIN"
		});
		await User.insertOne(superAdmin);
		console.log("SUPERADMIN created");
	} catch (error) {
		console.log(`Super Admin initialization failure:\n${error}`);
		close();
	}
}