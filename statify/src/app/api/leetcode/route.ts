import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile { ranking }
          submissionCalendar
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }

        recentSubmissionList(username: $username) {
          title
          titleSlug
          timestamp
          statusDisplay
        }
      }
    `;

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://leetcode.com",
                "Origin": "https://leetcode.com",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            body: JSON.stringify({ query, variables: { username } }),
            cache: "no-store",
        });

        const data = await response.json();

        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            return NextResponse.json({ error: "LeetCode returned errors", details: data.errors }, { status: 502 });
        }

        const user = data?.data?.matchedUser;
        const recent = data?.data?.recentSubmissionList ?? [];

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        /** DAILY COUNTS */
        const calendarJSON = JSON.parse(user.submissionCalendar || "{}");

        const dailyCounts: Record<string, number> = {};
        for (const [epoch, count] of Object.entries(calendarJSON)) {
            const date = new Date(Number(epoch) * 1000).toISOString().split("T")[0];
            dailyCounts[date] = Number(count);
        }

        /** MAP PROBLEMS SOLVED BY DAY */
        const dailySolvedProblems: Record<string, any[]> = {};

        recent
            .filter((r: any) => r.statusDisplay === "Accepted")
            .forEach((item: any) => {
                const date = new Date(Number(item.timestamp) * 1000).toISOString().split("T")[0];
                if (!dailySolvedProblems[date]) dailySolvedProblems[date] = [];
                dailySolvedProblems[date].push({
                    title: item.title,
                    slug: item.titleSlug,
                    timestamp: item.timestamp,
                });
            });

        return NextResponse.json(
            {
                username: user.username,
                ranking: user.profile?.ranking ?? null,
                solved: {
                    total: user.submitStats.acSubmissionNum[0].count,
                    easy: user.submitStats.acSubmissionNum[1].count,
                    medium: user.submitStats.acSubmissionNum[2].count,
                    hard: user.submitStats.acSubmissionNum[3].count,
                },
                dailyCounts,
                dailySolvedProblems,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("LeetCode API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
