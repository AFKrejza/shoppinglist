import express from "express";
import mongoose from "mongoose";
import { User, ShoppingList, Item } from "./db/models.js";

// main().catch(err => console.error(err));


const JohnDoe = new User({
	name: "John Doe",
	email: "john.doe@gmail.com"
});

const List1 = new ShoppingList({
	ownerId: 1,
	name: "List 1",
	memberList: [],
	itemList: [
		new Item({
			name: "apples",
			quantity: 6,
			unit: "",
			ticked: false,
		}),
		new Item({
			name: "milk",
			quantity: 2,
			unit: "l",
			ticked: false,
		}),
	],
	isArchived: false
});

console.log(`${JohnDoe}\n${List1}`);


// async function main() {
// 	// await mongoose.connect('mongodb:/127.0.0.1:27017/test');
	
// }

// main();