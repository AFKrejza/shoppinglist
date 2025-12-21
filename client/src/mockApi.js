// const SERVER_URL = `http://localhost:3000`;
// const listsUrl = `${SERVER_URL}/shoppinglists`;
// const authUrl = `${SERVER_URL}/auth`;
// const usersUrl = `${SERVER_URL}/users`;

// let fakeUsers = [
//   { id: 1, userName: "John", email: "john@gmail.com", password: "password" },
//   { id: 2, userName: "Sam", email: "sam@gmail.com", password: "password" }
// ];

// let fakeLists = [
//   {
//     id: 1,
//     ownerId: 1,
//     name: "Groceries",
//     isArchived: false,
//     memberList: ["2"],
//     itemList: [
//     	{ id: 1, name: "Milk", quantity: 2, unit: "L", ticked: false },
//     	{ id: 2, name: "Eggs", quantity: 12, unit: "pcs", ticked: false }
//     ]
//   },
//   {
//   	id: 2,
//     ownerId: 1,
//     name: "Groceries",
//     isArchived: false,
//     memberList: [],
//     itemList: [
//     	{ id: 1, name: "Milk", quantity: 2, unit: "L", ticked: false },
//     	{ id: 2, name: "Eggs", quantity: 12, unit: "pcs", ticked: false }
//     ]
//   }
// ];

// // mock jwts are === user.ids

// export const api = {

// 	auth: {
// 		async profile(jwt) {
// 			const userId = jwt;
// 			const user = fakeUsers.find(user => user.id === userId);
// 			if (!user) throw new Error("Unauthorized");
// 			return user;
// 		},
	
// 		async login(email, password) {
// 			console.log(`Log in: ${email}`)
// 			console.log(`${authUrl}/login`);
// 			const user = fakeUsers.find(user => user.email === email && user.password === password);
// 			console.log(user);
// 			if (!user)
// 				throw new Error(`INvalid login`);
	
// 			return {token: user.id}; // JWT
// 		},
	
// 		async register(path, body) {
// 			const newUser = {
// 				id: fakeUsers.length + 1,
// 				name: body.name,
// 				email: body.email,
// 				password: body.password
// 			};
// 			fakeUsers.push(newUser);
// 			return newUser;
// 		},
// 	},

// 	lists: {
// 		// async listAll() {
// 		// 	const path = listsUrl + `/listAll`;
// 		// },

// 		async getList() {
// 			const res = await fetch(`${listsUrl}/shoppingLists`);
			
// 			if (!res.ok) throw new Error("Failed to get shopping list");

// 			return res.json();
// 		},

// 		async getPage(jwt, page, pageSize) {
// 			return fakeLists.slice((page - 1) * pageSize, page * pageSize); // TODO: needs filtering by user
// 		},

// 		async addShoppingList(list) {
// 			const res = await fetch(`${listsUrl}/shoppingLists`, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify(list),
//   			});
// 			if (!res.ok) throw new Error("Failed to add shopping list");
// 			return res.json();
// 		},


// 	}

// };