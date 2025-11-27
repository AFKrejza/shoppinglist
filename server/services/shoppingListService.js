import { shoppingListDao } from "../dao/shoppingListDao.js";

export const shoppingListService = {
	async listPage(pageSize, skip, userId) {
		const lists = await shoppingListDao.getPage(userId, skip, pageSize);
		return lists;
	}
};