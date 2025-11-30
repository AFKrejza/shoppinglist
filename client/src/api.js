const SERVER_URL = `http://localhost:3000`;
const listsUrl = `${SERVER_URL}/shoppinglists`;
const authUrl = `${SERVER_URL}/auth`;
const usersUrl = `${SERVER_URL}/users`;

export const api = {

	auth: {
		async profile(jwt) {
			const res = await fetch(`${authUrl}/profile`, {
				method: "GET",
				headers: {  "Authorization": `Bearer ${jwt}` },
			});
			
			if (!res.ok)
				throw new Error(`Unauthorized`);
	
			return res.json();
		},
	
		async login(email, password) {
			console.log(`Log in: ${email}`)
			console.log(`${authUrl}/login`);
			const res = await fetch(`${authUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			console.log(res);
			if (!res.ok)
				throw new Error(`INvalid login`);
	
			return res.json(); // JWT
		},
	
		async register(path, body) {
			const res = await fetch(`${authUrl}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			if (!res.ok)
				throw new Error(`GET ${path} failed`);
	
			return res.json();
		},
	},

	lists: {
		// async listAll() {
		// 	const path = listsUrl + `/listAll`;
		// },

		async getList() {
			const res = await fetch(`${listsUrl}/shoppingLists`);
			
			if (!res.ok) throw new Error("Failed to get shopping list");

			return res.json();
		},

		async getPage(jwt, page, pageSize) {
			const res = await fetch(`${listsUrl}/list?page=${page}&pageSize=${pageSize}`, {
				method: "GET",
				headers: {  "Authorization": `Bearer ${jwt}` }
			});

			if (!res.ok) throw new Error("Failed to get shopping lists");

			return res.json();
		},

		async addShoppingList(list) {
			const res = await fetch(`${listsUrl}/shoppingLists`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(list),
  			});
			if (!res.ok) throw new Error("Failed to add shopping list");
			return res.json();
		},


	}

};