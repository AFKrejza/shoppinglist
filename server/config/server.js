import app from "../app.js";

const port = process.env.SERVER_PORT;

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export {
	server
}