"use client";

import { useEffect, useState } from "react";

export default function Leetcode({ username }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!username) return;

            const apiUrls = [
                `https://leetcode-api-faisalshohag.vercel.app/${username}`,
                `https://alfa-leetcode-api.onrender.com/userProfile/${username}`
            ];

            for (let url of apiUrls) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                        setError(null);
                        return;
                    }
                } catch (err) {
                    console.error(`Failed to fetch from ${url}:`, err);
                }
            }

            setError("Failed to fetch LeetCode data from both sources.");
        };

        fetchData().finally(() => setLoading(false));
    }, [username]);

    return (
        <div className="w-full p-4">
            {loading && <p>Loading your Leetcode data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {userData && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h1 className="text-5x">LeetCode</h1>
                    <h2 className="text-xl font-bold">{username}</h2>
                    <p>Rank: {userData.ranking || "N/A"}</p>
                    <p>Problems Solved: {userData.totalSolved || "N/A"}</p>
                </div>
            )}
        </div>
    );
}
