import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("🚀 Platform update API called");

    try {
        const body = await req.json();
        const { user: username, leetcodeId, codeforcesId, gfgId, githubId } = body;

        console.log("📥 Received data:", { username, leetcodeId, codeforcesId, gfgId, githubId });

        if (!username) {
            return NextResponse.json(
                { success: false, error: "Username is required" },
                { status: 400 }
            );
        }

        const formattedUsername = username.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
            where: { username: formattedUsername },
        });

        if (!existingUser) {
            console.log("❌ User not found:", formattedUsername);
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const updateData = {
            leetcodeId: leetcodeId || null,
            codeforcesId: codeforcesId || null,
            gfgId: gfgId || null,
            githubId: githubId || null,
        };

        console.log("🔄 Updating user with:", updateData);

        const updatedUser = await prisma.user.update({
            where: { username: formattedUsername },
            data: updateData,
        });

        console.log("✅ User updated successfully");

        return NextResponse.json(
            { success: true, user: updatedUser },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("💥 Platform update error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}