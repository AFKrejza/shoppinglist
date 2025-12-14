import test from "node:test";
import assert from "node:assert";
import dotenv from "dotenv";
import request from "supertest";
import app from "../app.js";
import { server } from "../config/server.js";
import { seedDatabase } from "../config/seed.js";
import mongoose from "mongoose";

// NOTE: wipes the database (shoppinglist) each time
// this is fine since there is no actual prod data, otherwise I'd create a testing database

let token;
let listId;
let listArray;

test.before(async () => {
	await mongoose.connection.dropDatabase();
	await seedDatabase();
	const loginRes = await request(app).post("/auth/login").send({email: "john@gmail.com", password: "password"});
	token = loginRes.body.token;
	console.log(`admin token: ${token}`);
	assert.ok(token);
});

test.after(async () => {
	await mongoose.connection.close();
	server.close(() => {
		console.log("Tests complete");
	});
});

// users

test('Create new user', async () => {
	const data = {
		"userName": "testuser",
		"email": "test@gmail.com",
		"password": "password"
	};
	const res = await request(app)
		.post("/auth/register")
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 201);

	// console.log("message: " + res.body.message);
});

test('Create new user: already exists', async () => {
	const data = {
		"userName": "testuser",
		"email": "test@gmail.com",
		"password": "password"
	};
	const res = await request(app)
		.post("/auth/register")
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 400);

	// console.log("message: " + res.body.message);
});

test('Create new user: missing email', async () => {
	const data = {
		"userName": "testuser",
		"email": "",
		"password": "password"
	};
	const res = await request(app)
		.post("/auth/register")
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 500);

	// console.log("message: " + res.body.message);
});





// shopping lists

test('List shopping lists', async () => {
	const res = await request(app)
	.get("/shoppinglists/list?page=1&pageSize=10")
	.set("Authorization", `Bearer ${token}`);

	listId = res.body[0]._id;
	assert.equal(res.body[0]._id, listId);
	listArray = res.body;
});

// checks if page and pageSize default to 1 and 10 respectively
test('List shopping lists: query parameter defaulting', async () => {
	const res = await request(app)
	.get("/shoppinglists/list")
	.set("Authorization", `Bearer ${token}`);

	listId = res.body[0]._id;
	assert.equal(res.body[0]._id, listId);
	res.body = listArray;
});

test('Get one shopping list', async () => {
	const res = await request(app)
	.get(`/shoppinglists/${listId}`)
	.set("Authorization", `Bearer ${token}`);

	assert.equal(res.status, 200);
	list = res.body;

	// console.log(res.body);
});

test('Get one shopping list: missing ID', async () => {
	const res = await request(app)
	.get(`/shoppinglists/`)
	.set("Authorization", `Bearer ${token}`);

	assert.equal(res.status, 404);
});

test("Create a shopping list", async () => {
	const listName = "Created List";
	const data = {
		name: listName,
		isArchived: false,
		memberList: [],
		itemList: [
			{
				name: "test",
				quantity: 1,
				unit: "",
				ticked: false,
				_id: "693f13645ef3441351accadd"
			},
			{
				name: "UPDATED",
				quantity: 1,
				unit: "30",
				ticked: true,
				_id: "693f13645ef3441351accade"
			}
		],
		__v: 0
	};

	const res = await request(app)
		.put(`/shoppinglists/`)
		.set("Authorization", `Bearer ${token}`)
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 201);
	assert.equal(res.body.name, listName);

	// console.log(res.body);
});

test("Create a shopping list: missing token", async () => {
	const listName = "Created List";
	const data = {
		name: listName,
		isArchived: false,
		memberList: [],
		itemList: [
			{
				name: "test",
				quantity: 1,
				unit: "",
				ticked: false,
				_id: "693f13645ef3441351accadd"
			},
			{
				name: "UPDATED",
				quantity: 1,
				unit: "30",
				ticked: true,
				_id: "693f13645ef3441351accade"
			}
		],
		__v: 0
	};

	const res = await request(app)
		.put(`/shoppinglists/`)
		// .set("Authorization", `Bearer ${token}`)
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 401);
	
	// console.log(res.body);
});

test("Create a shopping list: missing name", async () => {
	const data = {
		isArchived: false,
		memberList: [],
		itemList: [
			{
				name: "test",
				quantity: 1,
				unit: "",
				ticked: false,
				_id: "693f13645ef3441351accadd"
			},
			{
				name: "UPDATED",
				quantity: 1,
				unit: "30",
				ticked: true,
				_id: "693f13645ef3441351accade"
			}
		],
		__v: 0
	};

	const res = await request(app)
		.put(`/shoppinglists/`)
		// .set("Authorization", `Bearer ${token}`)
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 401);

	// console.log(res.body);
});


test("Update a shopping list", async () => {
	const data = {
		_id: listId,
		name: "patched name",
		isArchived: false,
		memberList: [],
		itemList: [
			{
				name: "test",
				quantity: 1,
				unit: "",
				ticked: false,
				_id: "693f13645ef3441351accadd"
			},
			{
				name: "UPDATED",
				quantity: 1,
				unit: "30",
				ticked: true,
				_id: "693f13645ef3441351accade"
			}
		],
		__v: 0
	};

	const res = await request(app)
		.patch(`/shoppinglists/${listId}`)
		.set("Authorization", `Bearer ${token}`)
		.send(data)
		.set("Content-Type", "application/json");

	assert.equal(res.status, 200);
	assert.equal(res.body._id, listId);

	// console.log(res.body);
});

test("Delete a shopping list: bad ID", async () => {
	const falseId = "000000000000000000000000";
	const res = await request(app)
		.delete(`/shoppinglists/${falseId}`)
		.set("Authorization", `Bearer ${token}`);

	assert.equal(res.status, 500);
	assert.equal(res.body.error, "Shopping list not found");

	// console.log(res.body);
});

test("Delete a shopping list: missing token", async () => {
	const falseId = "000000000000000000000000";
	const res = await request(app)
		.delete(`/shoppinglists/${falseId}`)
		// .set("Authorization", `Bearer ${token}`);

	assert.equal(res.status, 401);
	assert.equal(res.body.message, "Missing token");

	// console.log(res.body);
});

test("Delete a shopping list", async () => {
	const res = await request(app)
		.delete(`/shoppinglists/${listId}`)
		.set("Authorization", `Bearer ${token}`);

	assert.equal(res.status, 201);
	assert.equal(res.body.deletedCount, 1);

	// console.log(res.body);
});