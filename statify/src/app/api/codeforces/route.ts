import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const handle = searchParams.get("handle");

        if (!handle) {
            return NextResponse.json(
                { error: "Handle parameter is required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch CodeForces data" },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (data.status !== "OK") {
            return NextResponse.json(
                { error: data.comment || "Invalid CodeForces handle" },
                { status: 404 }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("CodeForces API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}