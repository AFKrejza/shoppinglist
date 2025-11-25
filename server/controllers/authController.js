import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../services/hashService.js";
import { generateToken } from "../services/jwtService.js";

// TODO: can i just write async function register(req, res) instead? I prefer it that way
async function register(req, res) {
	try {
		const { userName, email, password } = req.body;
		const existingUser = await User.findOne({ email }); // this works since it's a model? TODO: verify how mongoose actually works
		if (existingUser) {
			console.log("User already exists!");
			return res.status(400).json({ message: "User already exists!" }); // TODO: standardize error handling
		}
			
		const hashedPassword = await hashPassword(password);
		const user = new User({ userName, email, password: hashedPassword });
		await user.save(); // TODO: add verification that the user exists (like RETURN in postgres)
		console.log(`User ${email} registered`);
		res.status(201).json({ message: "User registered"});
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
			return res.status(400).json({ message: "Invalid email or password" });

		const checkPassword = await comparePassword(password, user.password);
		if (!checkPassword)
			return res.status(400).json({ message: "Invlid password" });

		const token = await generateToken({ id: user._id, email: user.email });

		res.json({message: "Logged in", token});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

// note: req.user is set by auth middleware after the token has been verified
async function profile(req, res) {
	res.json({
		message: "You are logged in",
		user: req.user
	});
};

export default {
	register,
	login,
	profile,
}