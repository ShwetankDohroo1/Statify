import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "../../utils/jwtToken";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const payload = getUserFromToken(request);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
            username: true,
            email: true,
            leetcodeId: true,
            codeforcesId: true,
            gfgId: true,
            githubId: true,
        },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}
