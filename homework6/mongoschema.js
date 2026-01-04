// this sample data is based on ./server/config/seed.js

db.users.insertMany([
	{
		userName: "superadmin",
		email: "admin@admin.com",
		password: "adminpassword",
		role: "SUPERADMIN"
	},
	{
		userName: "john",
		email: "john@gmail.com",
		password: "password",
		role: "USER"
	},
	{
		userName: "sam",
		email: "sam@gmail.com",
		password: "password",
		role: "USER"
	}
]);

// edited owner to use emails to make seeding way easier
db.lists.insertMany([
	{
		owner: "john@gmail.com",
		name: "Groceries",
		memberList: ["sam@gmail.com"],
		isArchived: false,
		itemList: [
			{
				name: "Milk",
				quantity: 2,
				unit: "L",
				ticked: false
			},
			{
				name: "Beer",
				quantity: 6,
				unit: "",
				ticked: false
			},
			{
				name: "Propane",
				quantity: 5,
				unit: "kg",
				ticked: false
			}

		]
	},
	{
		owner: "sam@gmail.com",
		name: "Clothes",
		memberList: ["john@gmail.com"],
		isArchived: false,
		itemList: [
			{
				name: "Gloves",
				quantity: 1,
				unit: "",
				ticked: false
			},
			{
				name: "Ski mask",
				quantity: 1,
				unit: "",
				ticked: false
			}
		]
	}
]);



// queries (same as in schema.sql, outputs match too.)

// show items from the Groceries list
db.lists.find(
	{ name: "Groceries" },
	{ "itemList.name": 1, "itemList.quantity": 1, "itemList.unit": 1, "itemList.ticked":1 }
);

// select all unarchived lists that user john@gmail.com is the owner of (just the names)
db.lists.find(
	{
		owner: "john@gmail.com",
		isArchived: false
	},
	{ name: 1 }
);

// count how many unticked items there are in all the unarchived lists that a given user is in (owner or member)
db.lists.aggregate([
	{
		$match: {
			isArchived: false,
			$or: [
				{ owner: "john@gmail.com" },
				{ memberList: "john@gmail.com"}
			]
		}
	},
	{ $unwind: "$itemList" },
	{ $match: { "itemList.ticked": false }},
	{ $count: "untickedItemCount" }
]);