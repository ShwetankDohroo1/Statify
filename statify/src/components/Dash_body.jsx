'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from './navbar';
import Leetcode from "./data/LeetCode";
import GFG from "./data/GFG";
import CodeForces from "./data/CodeForces";
import Github from "./data/Github";
import Mixed from "./data/Mixed";

export default function DashBody() {
    const [bgColor, setBgColor] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("dashboardBg") || "#f8fafc";
        }
        return "#f8fafc";
    });
    const [platformIds, setPlatformIds] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        if (!username) return;

        const fetchUserData = async () => {
            try {
                const userRes = await fetch(`/api/users/me?username=${username}`);
                if (!userRes.ok) throw new Error("Failed to fetch user data");
                const userData = await userRes.json();
                setPlatformIds(userData);

                // Fetch all platform data in parallel
                await Promise.all([
                    userData.leetcodeId && fetch(`/api/leetcode/${userData.leetcodeId}`),
                    userData.gfgId && fetch(`/api/gfg/${userData.gfgId}`),
                    userData.codeforcesId && fetch(`/api/codeforces/${userData.codeforcesId}`),
                    userData.githubId && fetch(`/api/github/${userData.githubId}`)
                ]);

                setLoading(false);
            }
            catch (err) {
                setError(err.message || "An error occurred while loading data.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    if (loading) return (
        <div className="min-h-screen p-8 space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div className="h-10 w-[200px] rounded-lg bg-gray-200 animate-pulse" />
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 rounded-xl bg-gray-200 animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-md flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bgColor }}>
            <NavBar onBgChange={setBgColor} />

            <main className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">SD</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Shwetank Dohroo</h2>
                                    <p className="text-sm text-gray-500">@username</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4">Your Accounts</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-500">LC</span>
                                        </div>
                                        <span className="font-medium">LeetCode</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{platformIds?.leetcodeId}</span>
                                </div>
                            </div>
                        </div>
                        {platformIds?.leetcodeId && platformIds?.gfgId &&
                            platformIds?.codeforcesId && platformIds?.githubId && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <Mixed username={username} />
                                </div>
                            )}
                    </div>
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold mb-4">278,534</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Top Platforms</h3>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span>LeetCode</span>
                                                <span>197,520</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Activity</h3>
                                        <div className="flex justify-between">
                                            <span>Problems Solved</span>
                                            <span>687</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {platformIds?.leetcodeId && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <Leetcode username={platformIds.leetcodeId} />
                                    </div>
                                )}
                                {platformIds?.gfgId && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <GFG username={platformIds.gfgId} />
                                    </div>
                                )}
                                {platformIds?.codeforcesId && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <CodeForces username={platformIds.codeforcesId} />
                                    </div>
                                )}
                                {platformIds?.githubId && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                        <Github username={platformIds.githubId} />
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold mb-4">Activity Timeline</h3>
                                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">Chart Preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}