import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../utils/comparePassword";
import { generateToken } from "../utils/jwtToken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function validateUser(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await validateUser(email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        try {
            await comparePassword(password, user.password);
        }
        catch (error) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = generateToken(user);

        const response = NextResponse.json({
            message: "Login Successfully",
            success: true,
            user: {
                username: user.username,
                leetcodeId: user.leetcodeId,
                codeforcesId: user.codeforcesId,
                gfgId: user.gfgId,
                githubId: user.githubId,
            },
        });

        response.headers.set(
            "Set-Cookie",
            `token=${token}; HttpOnly; Max-Age=${24 * 60 * 60}; Path=/`
        );

        return response;
    }
    catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
