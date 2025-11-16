import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// just have it return a JWT with the user's info
/*
e.g.
input: {
	"userName": "John",
	"password": "12345"
}
if verified, create JWT out of the user's id, username, and the secret in .env

*/

dotenv.config();

const secret = process.env.JWT_SECRET;

// TODO: have a function that validates the credentials in the db
// this function just assumes that the user exists and that the username and password are correct
// for testing purposes, it will always return a valid JWT
function authenticateUser(user) {
	const payload = { userId: 1 };
	const token = jwt.sign(payload, secret); // TODO: check options such as token expiration
	return token;
}

// TODO: add expiration, then ensure iat, exp, nbf are all correct
function authorizeUser(user, token) {
	const decoded = jwt.verify(token, secret);
	// TODO: decoded.userId: check the db AND check the req.body
	if (user.userId !== decoded.userId) {
		throw new Error("authorization failure");
	}
	console.log(decoded);
	return true;
}

export {
	authenticateUser,
	authorizeUser
}