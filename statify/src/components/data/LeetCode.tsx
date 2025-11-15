"use client";

import { useState } from "react";
import { LeetcodeResponse } from "../../app/fetchers/fetch-leetcode";

type Props = {
    username: string;
    userData: LeetcodeResponse | null
}

export default function Leetcode({ username, userData }: Props) {
    return (
        <div className="w-full p-4">
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
