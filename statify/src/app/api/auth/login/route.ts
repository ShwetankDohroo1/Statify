import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import comparePassword from "../../utils/comparePassword";
import { generateToken } from "../../utils/jwtToken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { values } = await request.json();
        const { email, password } = values;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        await comparePassword(password, user.password);
        const token = generateToken({ id: user.id, username: user.username, email: user.email });

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

        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            path: '/',
        });
        return response;
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
