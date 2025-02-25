import jwt from "jsonwebtoken";

export function generateToken(user) {
    const tokenData = {
        id: user.id, // Prisma uses `id` instead of `_id`
        username: user.username,
        email: user.email,
    };

    return jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
}
