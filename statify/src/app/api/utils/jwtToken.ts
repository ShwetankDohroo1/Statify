import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { User } from "@prisma/client";

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
        const token = req.cookies.get("token")?.value;

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

const generateToken = (user: Pick<User, 'id' | 'username' | 'email'>): string => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: "30d" }
    );
}

export { getUserFromToken, generateToken };
export type { UserPayload };