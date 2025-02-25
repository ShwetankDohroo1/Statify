import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username },
            select: { codeforcesId: true },
        });

        if (!user || !user.codeforcesId) {
            return NextResponse.json({ error: "CodeForces ID not found" }, { status: 404 });
        }

        return NextResponse.json({ codeforcesId: user.codeforcesId }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching CodeForces ID:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
