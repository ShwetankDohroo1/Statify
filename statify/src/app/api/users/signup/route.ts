import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hashPassword";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, password, email } = reqBody;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            message: "User created.",
            success: true,
            user: newUser,
        });
    }
    catch (err: any) {
        console.error("Error in user signup:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
