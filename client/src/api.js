const SERVER_URL = `http://localhost:3000`;
const listsUrl = `${SERVER_URL}/shoppinglists`;
const authUrl = `${SERVER_URL}/auth`;
// const usersUrl = `${SERVER_URL}/users`;

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

		async addShoppingList(jwt, name) {
			const res = await fetch(`${listsUrl}`, {
				method: "PUT",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${jwt}`
				},
				body: JSON.stringify({name}),
  			});
			if (!res.ok) throw new Error("Failed to add shopping list");
			return res.json();
		},

		// data can include partial data (check backend)
		async updateShoppingList(jwt, listId, data) {
			const res = await fetch(`${listsUrl}/${listId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${jwt}`
				},
				body: JSON.stringify(data)
			});

			if (!res.ok)
				throw new Error("Failed to update shopping list");

			return res.json(); // should return updated list
		},

		async updateItem(jwt, listId, itemData) {
			const res = await fetch(`${listsUrl}/${listId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwt}`
			},
			body: JSON.stringify(itemData) // { itemList: [...] }
			});
			if (!res.ok) throw new Error("Failed to update/create item");
			return res.json();
		},

		 async removeItem(jwt, listId, itemId) {
			const res = await fetch(`${listsUrl}/${listId}/items/${itemId}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${jwt}` }
			});
			console.log(res);
			if (!res.ok)
				throw new Error("Failed to remove item");

			// this is stupid but it just needs to work. Messed up the status codes
			 if (res.status === 200 || res.status === 201) {
			try {
				return await res.json();
			} catch {
				return null;
			}
		}
  return null;
		},

		async removeMember(jwt, listId, memberId) {
			const res = await fetch(`${listsUrl}/${listId}/members/${memberId}`, {
			method: "DELETE",
			headers: { "Authorization": `Bearer ${jwt}` }
			});
			if (!res.ok) throw new Error("Failed to remove member");
			return res.json();
		},

	}

};