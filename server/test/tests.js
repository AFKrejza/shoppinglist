import test from "node:test";
import assert from "node:assert";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.SERVER_PORT;
const BASE = `http://localhost:${PORT}`;

// server must be running

// TODO: think about making a test database
// with a toggle in .env? idk

test('Create new user', async () => {
	const url = `${BASE}/users/create`;
	const userName = "Test user";
	const email = "test@gmail.com";
	const password = "password";
	const data = {
		userName: userName,
		email: email,
		password: password
	}
	const response = await fetch(url, {
		method: "PUT",
		body: JSON.stringify(data),
	});
	console.log(response);
	assert.ok(response);
	assert.strictEqual(response.userName, userName);

})