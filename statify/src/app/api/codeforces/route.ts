import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const handle = new URL(req.url).searchParams.get("handle");

        if (!handle) {
            return NextResponse.json({ error: "Handle parameter is required" }, { status: 400 });
        }

        const profileRes = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`,
            { cache: "no-store" }
        );
        const profile = await profileRes.json();

        if (profile.status !== "OK") {
            return NextResponse.json({ error: "Invalid handle" }, { status: 404 });
        }

        const submissionsRes = await fetch(
            `https://codeforces.com/api/user.status?handle=${handle}`,
            { cache: "no-store" }
        );
        const submissions = await submissionsRes.json();

        if (submissions.status !== "OK") {
            return NextResponse.json({ error: "Could not fetch submissions" }, { status: 500 });
        }

        return NextResponse.json(
            {
                profile: profile.result[0],
                submissions: submissions.result
            },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
