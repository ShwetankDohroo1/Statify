import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { token, password } = reqBody;

        const user = await prisma.user.findFirst({
            where: {
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null,
            },
        });
        return NextResponse.json({ message: "Password reset successfully" });
    } 
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } 
    finally {
        await prisma.$disconnect();
    }
}
