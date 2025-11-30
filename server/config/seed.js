import { User } from "../models/User.js";
import { hashPassword } from "../services/hashService.js";
import { ShoppingList } from "../models/ShoppingList.js";
import mongoose from "mongoose";

// ensures there's always a superadmin
async function setSuperAdmin() {
	try {
		const superEmail = process.env.SUPERADMIN_EMAIL;
		const superPassword = process.env.SUPERADMIN_PASSWORD;
	
		const existingSuper = await User.findOne({ email: superEmail });
		if (existingSuper) {
			return;
		}
	
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

export async function seedDatabase() {

	const userCount = await User.countDocuments();
	const listCount = await ShoppingList.countDocuments();
	if (userCount || listCount) {
		console.log("Data found, skipping seeding");
		return;
	}
	console.log("Creating seed data");

	await setSuperAdmin();

	const userId1 = new mongoose.Types.ObjectId();
	const userId2 = new mongoose.Types.ObjectId();

	const user1Password = "password";
	const user2Password = "password";
	
	const listId1 = new mongoose.Types.ObjectId();
	const listId2 = new mongoose.Types.ObjectId();
	
	await User.create([
		{
			_id: userId1,
			userName: "john",
			email: "john@gmail.com",
			password: await hashPassword(user1Password),
			role: "USER"
		},
		{
			_id: userId2,
			userName: "sam",
			email: "sam@gmail.com",
			password: await hashPassword(user2Password),
			role: "USER"
		},
	]);
	
	await ShoppingList.create([
		{
			_id: listId1,
			ownerId: userId1,
			name: "Groceries",
			memberList: [userId2.toString()],
			itemList: [
				{
					_id: new mongoose.Types.ObjectId(),
					name: "Milk",
					quantity: 2,
					unit: "L",
					ticked: false
				},
				{
					_id: new mongoose.Types.ObjectId(),
					name: "Beer",
					quantity: 6,
					unit: "",
					ticked: false
				},
				{
					_id: new mongoose.Types.ObjectId(),
					name: "Propane",
					quantity: 5,
					unit: "kg",
					ticked: false
				}
	
			]
		},
		{
			_id: listId2,
			ownerId: userId2,
			name: "Clothes",
			memberList: [],
			itemList: [
				{
					_id: new mongoose.Types.ObjectId(),
					name: "Gloves",
					quantity: 1,
					unit: "",
					ticked: false
				},
				{
					_id: new mongoose.Types.ObjectId(),
					name: "Ski mask",
					quantity: 1,
					unit: "",
					ticked: false
				}
			]
		}
	]);
	console.log("Seed data created");
}


// export async function setMockData() {
// 	try {

// 		for (const user of mockUsers) {
// 			const req = {};
// 			const res = {};
// 			req.body.userName = user.userName;
// 			req.body.email = user.email;
// 			req.body.password = user.password;
// 			await register(req, res);
// 		}

// 		for (const list of mockLists) {

// 		}

// 	}
// }

// const mockUsers = [
// 	new User({
// 		userName: "john",
// 		email: "john@gmail.com",
// 		password: "password",
// 	}),
// 	new User({
// 		userName: "sam",
// 		email: "sam@gmail.com",
// 		password: "password",
// 	}),
// 	new User({
// 		userName: "admin",
// 		email: "admin@gmail.com",
// 		password: "password",
// 	}),
// ];
