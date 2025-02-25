// src/app/api/users/platform/route.js
import prisma from "lib/prisma";

export async function POST(req) {
    console.log("Received request on /api/users/platform");
    try {
        const { username, leetcodeId, codeforcesId, gfgId, githubId } = await req.json();
        console.log("Request Body:", { username, leetcodeId, codeforcesId, gfgId, githubId });
        const formattedUsername = username;
        const existingUser = await prisma.user.findUnique({
            where: { username: formattedUsername },
        });

        if(!existingUser){
            return new Response(
                JSON.stringify({ success: false, error: "User not found" }),
                { status: 404 }
            );
        }

        const updateData = {
            leetcodeId: leetcodeId || null,
            codeforcesId: codeforcesId || null,
            gfgId: gfgId || null,
            githubId: githubId || null,
        };

        const user = await prisma.user.update({
            where: { username: formattedUsername },
            data: updateData,
        });

        return new Response(
            JSON.stringify({ success: true, user }),
            { status: 200 }
        );
    } 
    catch (error) {
        console.error("Prisma Error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}
