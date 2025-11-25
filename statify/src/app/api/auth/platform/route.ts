import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../utils/jwtToken";

export async function POST(req: NextRequest) {
    console.log("🚀 Platform update API called");

    try {
        // Get authenticated user from token
        const tokenUser = getUserFromToken(req);

        if (!tokenUser) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { leetcodeId, codeforcesId, gfgId, githubId } = body;

        console.log("📥 Received data for user:", tokenUser.username);

        const updateData = {
            leetcodeId: leetcodeId || null,
            codeforcesId: codeforcesId || null,
            gfgId: gfgId || null,
            githubId: githubId || null,
        };

        console.log("🔄 Updating user with:", updateData);

        const updatedUser = await prisma.user.update({
            where: { id: tokenUser.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                leetcodeId: true,
                codeforcesId: true,
                gfgId: true,
                githubId: true,
            },
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