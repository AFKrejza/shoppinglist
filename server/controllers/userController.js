// import userService
import { userService } from "../services/userService.js";

export const userController = {

	async update(req, res) {
		try {
			const targetId = req.params.id;
			const userId = req.user.id;
			const data = req.body;
			await userService.update(targetId, userId, data);
			console.log(`User ${userId} updated`);
			return res.status(200).json(`Updated`);
		} catch (error) {
			console.log(error);
			res.status(500).json({ errors: error.message });
		}
	},

	async remove(req, res) {
		try {
			const userId = req.user.id;
			const targetId = req.params.id;
			await userService.remove(targetId, userId);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error.message });
		}

	}

};