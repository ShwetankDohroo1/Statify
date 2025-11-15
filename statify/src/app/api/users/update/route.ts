import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const data = await req.json();

        const updated = await prisma.user.update({
            where: { username: data.username },
            data: {
                username: data.username,
                email: data.email,
                leetcodeId: data.leetcodeId,
                gfgId: data.gfgId,
                codeforcesId: data.codeforcesId,
                githubId: data.githubId,
            },
        });

        return NextResponse.json({ success: true, updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
