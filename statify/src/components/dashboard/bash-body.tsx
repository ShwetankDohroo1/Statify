'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '../navbar';
import Leetcode from '../data/LeetCode';
import CodeForces from '../data/CodeForces';
import useUserDetails from '../../app/hook/useUserDetails';
import { GFGResponse } from '../../app/fetchers/fetch-gfg';
import { CodeForcesReponse } from '../../app/fetchers/fetch-codeforces';
import { useDashboardData } from '@/app/dashboard/useDashboardData';
import GFG from '../data/GFG';
import Github from '../data/Github';
import { SHADES } from './constant';
import UserCard from './user-card';
import { User } from '@/app/fetchers/get-user';
import PlotGraph from '../plot-graph';

type PlatformId = {
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
};

type UserData = {
    username: string;
    totalSolved: number;
    github: {
        name: string;
        avatar: string;
        profileUrl: string;
        bio: string | null;
        followers: number;
        publicRepos: number;
    } | null;
    gfg: GFGResponse | null;
    leetcode: any | null;
    codeforces: CodeForcesReponse | null;
};

type AccountsListProps = {
    platformIds: PlatformId;
    userData: UserData;
};

type DashboardContentProps = {
    platformIds: PlatformId;
    userData: UserData;
    codeforcesTotal?: number;
    avgRank?: number;
};

type SidebarProps = {
    platformIds: PlatformId;
    username: string;
    userData: UserData;
    userDetails?: User;
};

type AccountItemProps = {
    name: string;
    id: string;
    color: string;
};

type StatsCardProps = {
    totalProblems: string;
    avgRank?: number
};

export default function DashBody() {
    const { username } = useParams<{ username?: string }>() ?? {};
    const [bgColor, setBgColor] = useState('#fdf6e3');

    const {
        userData: userDetails,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useUserDetails(username);

    const platformIds = useMemo(
        () => ({
            leetcodeId: userDetails?.leetcodeId || "",
            codeforcesId: userDetails?.codeforcesId || "",
            gfgId: userDetails?.gfgId || "",
            githubId: userDetails?.githubId || "",
        }),
        [userDetails]
    );

    const {
        leetcodeData,
        gfgData,
        githubData,
        codeforcesData,
        isLoading: isPlatformLoading,
        isError: isPlatformError,
    } = useDashboardData(platformIds);

    const isLoading = isUserLoading || isPlatformLoading;
    const isError = isUserError || isPlatformError;

    if (isLoading) return <LoadingUI />;
    if (isError) return <ErrorUI message="Something went wrong" />;

    const solved = codeforcesData?.submissions?.filter((s: any) => s.verdict === "OK");
    const uniqueSolved = new Set(
        solved.map((s: any) => `${s.problem.contestId}-${s.problem.index}`)
    );

    const ranks = [
        leetcodeData?.ranking ?? null,
        gfgData?.data?.institute_rank ?? null,
        codeforcesData?.rating ?? null,
    ].filter(r => r !== null) as number[];

    const avgRank = ranks.length > 0
        ? Math.round(ranks.reduce((acc, r) => acc + r, 0) / ranks.length)
        : undefined;


    const combinedData: UserData = {
        username: username ?? '',
        totalSolved:
            (leetcodeData?.solved.total || 0) +
            (gfgData?.data.total_problems_solved || 0) +
            (uniqueSolved?.size || 0),
        github: githubData
            ? {
                name: githubData.name || 'N/A',
                avatar: githubData.avatar_url || '',
                profileUrl: githubData.html_url || '#',
                bio: githubData.bio,
                followers: githubData.followers,
                publicRepos: githubData.public_repos
            }
            : null,
        gfg: gfgData || null,
        leetcode: leetcodeData ?? null,
        codeforces: codeforcesData ?? null
    };

    return (
        <div
            className="min-h-screen transition-colors duration-300 text-gray-900"
            style={{ backgroundColor: bgColor }}
        >
            <NavBar onBgChange={setBgColor} />
            <main className="p-6 flex flex-col lg:flex-row gap-6">
                <Sidebar
                    platformIds={platformIds}
                    username={username ?? ''}
                    userDetails={userDetails}
                    userData={combinedData}
                />
                <DashboardContent
                    platformIds={platformIds}
                    userData={combinedData}
                    codeforcesTotal={uniqueSolved?.size}
                    avgRank={avgRank}
                />
            </main>
            <PlotGraph dailyCounts={leetcodeData.dailyCounts} dailySolved={leetcodeData.dailySolvedProblems} />
        </div>
    );
}

const LoadingUI = () => (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-lg animate-pulse">Loading...</div>
    </div>
);

const ErrorUI = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-md">{message}</div>
    </div>
);

const Sidebar = ({ platformIds, username, userDetails, userData }: SidebarProps) => (
    <aside className="w-full lg:w-1/4 space-y-6">
        <UserCard username={username} userData={userDetails} />
        <AccountsList platformIds={platformIds} userData={userData} />
        {platformIds?.githubId && (
            <div
                className={`p-6 rounded-xl shadow-lg border ${SHADES[5]} hover:scale-105 transition-all duration-300`}
            >
                <Github data={userData.github} />
            </div>
        )}
    </aside>
);

const AccountsList = ({ platformIds, userData }: AccountsListProps) => {
    return (
        <div className="bg-green-200 p-6 rounded-xl shadow-md border border-green-400">
            <h3 className="font-semibold mb-4 text-gray-700">Your Accounts</h3>
            <ul className="space-y-3">
                {platformIds?.leetcodeId && (
                    <AccountItem name="LeetCode" id={platformIds.leetcodeId} color="yellow" />
                )}
                {platformIds?.gfgId && (
                    <AccountItem name="GFG" id={platformIds.gfgId} color="green" />
                )}
                {platformIds?.codeforcesId && (
                    <AccountItem name="CodeForces" id={platformIds.codeforcesId} color="blue" />
                )}
                {platformIds?.githubId && userData?.github && (
                    <li className="flex justify-between items-center text-white p-4 rounded-lg shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md">
                                G
                            </div>
                            <span className="font-medium">GitHub</span>
                        </div>
                        <span className="text-sm opacity-80">{platformIds.githubId}</span>
                    </li>
                )}
            </ul>
        </div>
    );
};

const colorMap: Record<string, string> = {
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
};

const AccountItem = ({ name, id, color }: AccountItemProps) => {
    const bg = colorMap[color] || "bg-gray-500";

    const LINKS: Record<string, string> = {
        LeetCode: `https://leetcode.com/${id}`,
        Codeforces: `https://codeforces.com/profile/${id}`,
        GitHub: `https://github.com/${id}`,
        GFG: `https://auth.geeksforgeeks.org/user/${id}`,
    };

    const handleClick = () => {
        window.open(LINKS[name], "_blank");
    };

    return (
        <li
            onClick={handleClick}
            className="cursor-pointer flex justify-between items-center text-white p-4 rounded-lg shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition-all duration-300"
        >
            <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full ${bg} text-white flex items-center justify-center shadow-md`}>
                    {name.charAt(0)}
                </div>
                <span className="font-medium">{name}</span>
            </div>
            <span className="text-sm opacity-80">{id}</span>
        </li>
    );
};

const DashboardContent = ({ platformIds, userData, codeforcesTotal, avgRank }: DashboardContentProps) => {
    return (
        <section className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
                totalProblems={userData.totalSolved.toString()}
                avgRank={avgRank}
            />

            {platformIds?.leetcodeId && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${SHADES[2]} hover:scale-105 transition-all duration-300`}
                >
                    <Leetcode userData={userData.leetcode} />
                </div>
            )}

            {userData?.gfg && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${SHADES[3]} hover:scale-105 transition-all duration-300`}
                >
                    <GFG userData={userData.gfg} />
                </div>
            )}

            {platformIds?.codeforcesId && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${SHADES[4]} hover:scale-105 transition-all duration-300`}
                >
                    <CodeForces userData={userData.codeforces} solved={codeforcesTotal} />
                </div>
            )}
        </section>
    );
};

const StatsCard = ({ totalProblems, avgRank }: StatsCardProps) => (
    <div
        className={`p-6 rounded-xl shadow-lg border hover:scale-105 transition-all duration-300`}
    >
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h1>Total Problems Solved</h1>
                <p className="text-4xl font-bold text-blue-600">{totalProblems}</p>
            </div>
            <div className="">
                <h1>Average Rank</h1>
                <p className="text-4xl font-bold text-blue-600">{avgRank}</p>
            </div>
        </div>
    </div>
);
