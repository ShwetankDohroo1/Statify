import bcryptjs from "bcryptjs";

export async function comparePassword(inputPassword, storedPassword) {
    const validPassword = await bcryptjs.compare(inputPassword, storedPassword);
    if (!validPassword) {
        throw new Error("Invalid password");
    }
    return validPassword;
}
