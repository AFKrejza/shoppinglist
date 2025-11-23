import dotenv from "dotenv";
import jwt, { decode } from "jsonwebtoken";

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
	const token = jwt.sign(user.userName, secret); // TODO: check options such as token expiration
	return token;
}

// TODO: add expiration, then ensure iat, exp, nbf are all correct
// check if user is a member or owner of a shopping list
function authorizeOwner(decodedUser, shoppingList) {
	if (decodedUser.userId === shoppingList.ownerId) {
		return true;
	}
	else return false;
}

function authorizeMember(decodedUser, shoppingList) {
	if (authorizeOwner(decodedUser, shoppingList)) return true;
	return shoppingList.memberList.includes(decodedUser.userId);
}

function decodeUser(token) {
	// TODO: decoded.userId: check the db AND check the req.body
	try {
		const decoded = jwt.verify(token, secret);
		console.log(decoded);
		return decoded;
	} catch {
		throw new Error("Invalid token");
	}
}

export {
	authenticateUser,
	authorizeOwner,
	authorizeMember,
	decodeUser
}