import bcrypt from "bcryptjs";

export const hashPassword = async (plainText) => {
	return await bcrypt.hash(plainText, 10);
};

export const comparePassword = async (plainText, hashedText) => {
	return await bcrypt.compare(plainText, hashedText);
};
