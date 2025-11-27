import mongoose from "mongoose"

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
	} catch (error) {
		console.error(`DB error: ${error}`);
		process.exit(1);
	}
}

export {
	connectDB
}