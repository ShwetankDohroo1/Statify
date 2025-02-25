import { useEffect, useState } from "react";

export default function Mixed({ username }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`/api/users/me?username=${username}`);
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user data from database");
                }
                const user = await userResponse.json();

                const { leetcodeId, codeforcesId, gfgId, githubId } = user;
                console.log(leetcodeId, codeforcesId, gfgId, githubId);
                const [leetcodeRes, codeforcesRes, githubRes, gfgRes] = await Promise.all([
                    fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeId}`),
                    fetch(`https://codeforces.com/api/user.info?handles=${codeforcesId}`),
                    fetch(`https://api.github.com/users/${githubId}`),
                    fetch(`/api/gfg?username=${gfgId}`)
                ]);

                if (!leetcodeRes.ok) throw new Error("Failed to fetch Leetcode data");
                if (!codeforcesRes.ok) throw new Error("Failed to fetch Codeforces data");
                if (!githubRes.ok) throw new Error("Failed to fetch GitHub data");
                if (!gfgRes.ok) throw new Error("Failed to fetch GFG data");

                const leetcodeData = await leetcodeRes.json();
                const codeforcesData = await codeforcesRes.json();
                const githubData = await githubRes.json();
                const gfgData = await gfgRes.json();
                const combinedData = {
                    username,
                    totalSolved:
                        (leetcodeData.totalSolved || 0) +
                        (gfgData.data.total_problems_solved || 0),
                    rating: codeforcesData?.result?.[0]?.rating || "N/A",
                    github: {
                        name: githubData.name || "N/A",
                        avatar: githubData.avatar_url || "",
                        profileUrl: githubData.html_url || "#"
                    },
                };

                setUserData(combinedData);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);
    console.log(userData);
    return (
        <div className="w-full p-4">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {userData && (
                <div className="bg-white flex flex-col justify-center items-center p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">User: {userData.username}</h2>
                    <p className="mt-2">Total Problems Solved: {userData.totalSolved}</p>
                    <div className="flex items-center mt-4">
                        <img src={userData.github.avatar} alt="GitHub Avatar" className="w-12 h-12 rounded-full" />
                        <div className="ml-3">
                            <p className="font-semibold">{userData.github.name}</p>
                            <a href={userData.github.profileUrl} target="_blank" className="text-blue-500">
                                GitHub Profile
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
