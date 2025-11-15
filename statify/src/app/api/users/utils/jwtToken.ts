import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.TOKEN_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

type UserPayload = {
    id: string;
    username: string;
    email: string;
}

const getUserFromToken = (req: NextRequest): UserPayload | null => {
    try {
        const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

const generateToken = (user: UserPayload): string => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "30d" });
}

export { getUserFromToken, generateToken };