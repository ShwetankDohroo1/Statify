'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "./navbar";
import Leetcode from "./data/LeetCode";
import GFG from "./data/GFG";
import CodeForces from "./data/CodeForces";
import Github from "./data/Github";
import Mixed from "./data/Mixed";

export default function DashBody() {
    const { username } = useParams();
    const [bgColor, setBgColor] = useState("#fdf6e3");
    const [platformIds, setPlatformIds] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

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

                const [leetcodeRes, codeforcesRes, githubRes] = await Promise.all([
                    fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeId}`),
                    fetch(`https://codeforces.com/api/user.info?handles=${codeforcesId}`),
                    fetch(`https://api.github.com/users/${githubId}`)
                ]);

                if (!leetcodeRes.ok) throw new Error("Failed to fetch Leetcode data");
                if (!codeforcesRes.ok) throw new Error("Failed to fetch Codeforces data");
                if (!githubRes.ok) throw new Error("Failed to fetch GitHub data");

                const leetcodeData = await leetcodeRes.json();
                const codeforcesData = await codeforcesRes.json();
                const githubData = await githubRes.json();
                let gfgData = null;
                if (gfgId) {
                    try {
                        const gfgRes = await fetch(`/api/gfg?username=${gfgId}`, { cache: 'no-store' });
                        if (gfgRes.ok) {
                            gfgData = await gfgRes.json();
                        } else {
                            console.error("GFG data not available, status:", gfgRes.status);
                        }
                    } catch (err) {
                        console.error("Error fetching GFG data:", err);
                    }
                }

                const combinedData = {
                    username,
                    totalSolved:
                        (leetcodeData.totalSolved || 0) +
                        (gfgData?.data?.total_problems_solved || 0),
                    rating: codeforcesData?.result?.[0]?.rating || "N/A",
                    github: {
                        name: githubData.name || "N/A",
                        avatar: githubData.avatar_url || "",
                        profileUrl: githubData.html_url || "#",
                        bio: githubData.bio,
                        followers: githubData.followers
                    },
                    gfg: gfgData?.data || null,
                };

                setUserData(combinedData);
                setPlatformIds({ leetcodeId, codeforcesId, gfgId, githubId });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    if (loading) return <LoadingUI />;
    if (error) return <ErrorUI message={error} />;

    return (
        <div className="min-h-screen transition-colors duration-300 text-gray-900" style={{ backgroundColor: bgColor }}>
            <NavBar onBgChange={setBgColor} />
            <main className="p-6 flex flex-col lg:flex-row gap-6">
                <Sidebar platformIds={platformIds} username={username} userData={userData} />
                <DashboardContent platformIds={platformIds} userData={userData} />
            </main>
        </div>
    );
}

const LoadingUI = () => (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-lg">Loading...</div>
    </div>
);

const ErrorUI = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-md">{message}</div>
    </div>
);

const Sidebar = ({ platformIds, username, userData }) => (
    <aside className="w-full lg:w-1/4 space-y-6">
        <UserCard username={username} />
        <AccountsList platformIds={platformIds} userData={userData} />
        {platformIds?.leetcodeId && platformIds?.gfgId && platformIds?.codeforcesId && platformIds?.githubId && (
            <div className="bg-indigo-200 p-6 rounded-xl shadow-md border border-indigo-400">
                <Mixed username={username} />
            </div>
        )}
    </aside>
);

const UserCard = ({ username }) => (
    <div className="p-6 rounded-xl shadow-lg border border-blue-400 bg-gradient-to-br from-blue-300 to-blue-500 text-white hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-md">
                {username.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="text-xl font-semibold">{username}</h2>
                <p className="text-sm opacity-80">@{username}</p>
            </div>
        </div>
    </div>
);

const AccountsList = ({ platformIds, userData }) => {
    const shades = [
        "bg-blue-100 border-blue-300",
        "bg-blue-200 border-blue-400",
        "bg-blue-300 border-blue-500",
        "bg-blue-400 border-blue-600",
        "bg-blue-500 border-blue-700",
        "bg-blue-600 border-blue-800 text-white"
    ];

    return (
        <div className="bg-green-200 p-6 rounded-xl shadow-md border border-green-400">
            <h3 className="font-semibold mb-4 text-gray-700">Your Accounts</h3>
            <ul className="space-y-3">
                {platformIds?.leetcodeId && <AccountItem name="LeetCode" id={platformIds.leetcodeId} color="yellow" />}
                {platformIds?.gfgId && <AccountItem name="GFG" id={platformIds.gfgId} color="green" />}
                {platformIds?.codeforcesId && <AccountItem name="CodeForces" id={platformIds.codeforcesId} color="blue" />}
                {platformIds?.githubId && userData && userData.github && (
                    <DataCard component={Github} id={platformIds.githubId} data={userData.github} shade={shades[5]} />
                )}
            </ul>
        </div>
    );
};


const AccountItem = ({ name, id, color }) => (
    <li className="flex justify-between items-center text-white p-4 rounded-lg shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full bg-${color}-500 text-white flex items-center justify-center shadow-md`}>
                {name.charAt(0)}
            </div>
            <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm opacity-80">{id}</span>
    </li>
);

const DashboardContent = ({ platformIds, userData }) => {
    const shades = [
        "bg-blue-100 border-blue-300",
        "bg-blue-200 border-blue-400",
        "bg-blue-300 border-blue-500",
        "bg-blue-400 border-blue-600",
        "bg-blue-500 border-blue-700",
        "bg-blue-600 border-blue-800 text-white"
    ];

    return (
        <section className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard text="Total Problems Solved" title="Overall" value="278,534" shade={shades[0]} userData={userData} />
            {/* <StatsCard title="Top Platform" value="LeetCode: 197,520" shade={shades[1]} userData={userData} /> */}
            {platformIds?.leetcodeId && <DataCard component={Leetcode} id={platformIds.leetcodeId} shade={shades[2]} />}
            {userData?.gfg && (
                <div className={`p-6 rounded-xl shadow-lg border ${shades[3]} hover:scale-105 transition-all duration-300`}>
                    <GFG userData={userData.gfg} />
                </div>
            )}
            {platformIds?.codeforcesId && <DataCard component={CodeForces} id={platformIds.codeforcesId} shade={shades[4]} />}
            {platformIds?.githubId && <DataCard component={Github} id={platformIds.githubId} shade={shades[5]} />}
        </section>
    );
};

const StatsCard = ({ text, value, shade, title, userData }) => (
    <div className={`p-6 rounded-xl shadow-lg border ${shade} hover:scale-105 transition-all duration-300`}>
        <h1 className="text-5x">{title}</h1>
        {userData && (
            <>
                <h2 className="text-xl font-bold">Your Username: {userData.username}</h2>
                <p className="font-semibold mb-2 text-lg">Total Problems Solved: {userData.totalSolved}</p>
            </>
        )}
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const DataCard = ({ component: Component, id, shade }) => (
    <div className={`p-6 rounded-xl shadow-lg border ${shade} hover:scale-105 transition-all duration-300`}>
        <Component username={id} />
    </div>
);
