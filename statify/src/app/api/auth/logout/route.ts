import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse.json({ message: "Logged out" });

    res.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
    });

    return res;
}
