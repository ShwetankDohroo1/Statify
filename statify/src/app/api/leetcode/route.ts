import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { username },
            }),
            cache: "no-store",
        });

        const data = await response.json();

        if (!data.data?.matchedUser) {
            return NextResponse.json(
                { error: "User not found on LeetCode" },
                { status: 404 }
            );
        }

        const stats = data.data.matchedUser;

        return NextResponse.json(
            {
                username: stats.username,
                ranking: stats.profile.ranking,
                solved: {
                    total: stats.submitStats.acSubmissionNum[0].count,
                    easy: stats.submitStats.acSubmissionNum[1].count,
                    medium: stats.submitStats.acSubmissionNum[2].count,
                    hard: stats.submitStats.acSubmissionNum[3].count,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("LeetCode API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
