import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../services/hashService.js";
import { generateToken } from "../services/jwtService.js";
import { userService } from "../services/userService.js";

async function register(req, res) {
	try {
		const { userName, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			console.log("User already exists!");
			return res.status(400).json({ message: "User already exists!" });
		}
			
		const hashedPassword = await hashPassword(password);
		const user = new User({ userName, email, password: hashedPassword });
		await user.save();
		console.log(`User ${email} registered`);
		res.status(201).json({ message: "User registered. Please log in."});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

async function login(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "Invalid email" });

		const checkPassword = await comparePassword(password, user.password);
		if (!checkPassword)
			return res.status(400).json({ message: "Invalid password" });

		const token = await generateToken({ id: user._id });

		res.json({message: "Logged in", token});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

// note: req.user is set by authMiddleware after the token has been verified
async function profile(req, res) {
	try {
		const user = await userService.findById(req.user.id);
		if (!user)
			return res.status(404).json({ message: "User not found" });
		res.json({
			message: "You are logged in",
			user: user
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default {
	register,
	login,
	profile,
}