import bcryptjs from "bcryptjs";

const comparePassword = async(inputPassword, storedPassword) => {
    const validPassword = await bcryptjs.compare(inputPassword, storedPassword);
    if (!validPassword) {
        throw new Error("Invalid password");
    }
    return validPassword;
}

export default comparePassword;
