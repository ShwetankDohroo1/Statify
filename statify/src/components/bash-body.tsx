'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from './navbar';
import Leetcode from './data/LeetCode';
import GFG from './data/GFG';
import CodeForces from './data/CodeForces';
import Github from './data/Github';
import Mixed from './data/Mixed';
import useUserDetails from '../app/hook/useUserDetails';
import { GFGResponse } from '../app/fetchers/fetch-gfg';
import { CodeForcesReponse } from '../app/fetchers/fetch-codeforces';
import { useDashboardData } from '@/app/dashboard/useDashboardData';

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
};

type SidebarProps = {
    platformIds: PlatformId;
    username: string;
    userData: UserData;
};

type UserCardProp = {
    username: string;
};

type AccountItemProps = {
    name: string;
    id: string;
    color: string;
};

type StatsCardProps = {
    text: string;
    title: string;
    value: string;
    shade: string;
    userData: UserData;
};

export default function DashBody() {
    const { username } = useParams<{ username?: string }>() ?? {};
    const [bgColor, setBgColor] = useState('#fdf6e3');

    const {
        userData,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useUserDetails(username);

    const leetcodeId = userData?.leetcodeId ?? '';
    const codeforcesId = userData?.codeforcesId ?? '';
    const gfgId = userData?.gfgId ?? '';
    const githubId = userData?.githubId ?? '';

    const platformIds: PlatformId = { leetcodeId, codeforcesId, gfgId, githubId };

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

    const combinedData: UserData = {
        username: username ?? '',
        totalSolved:
            (leetcodeData?.totalSolved || 0) +
            (gfgData?.data.total_problems_solved || 0),
        github: githubData
            ? {
                name: githubData.name || 'N/A',
                avatar: githubData.avatar_url || '',
                profileUrl: githubData.html_url || '#',
                bio: githubData.bio,
                followers: githubData.followers,
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
                    userData={combinedData}
                />
                <DashboardContent
                    platformIds={platformIds}
                    userData={combinedData}
                />
            </main>
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

const Sidebar = ({ platformIds, username, userData }: SidebarProps) => (
    <aside className="w-full lg:w-1/4 space-y-6">
        <UserCard username={username} />
        <AccountsList platformIds={platformIds} userData={userData} />
        {platformIds?.leetcodeId &&
            platformIds?.gfgId &&
            platformIds?.codeforcesId &&
            platformIds?.githubId && (
                <div className="bg-indigo-200 p-6 rounded-xl shadow-md border border-indigo-400">
                    <Mixed userData={userData} />
                </div>
            )}
    </aside>
);

const UserCard = ({ username }: UserCardProp) => (
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

const AccountItem = ({ name, id, color }: AccountItemProps) => (
    <li className="flex justify-between items-center text-white p-4 rounded-lg shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3">
            <div
                className={`h-8 w-8 rounded-full bg-${color}-500 text-white flex items-center justify-center shadow-md`}
            >
                {name.charAt(0)}
            </div>
            <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm opacity-80">{id}</span>
    </li>
);

const DashboardContent = ({ platformIds, userData }: DashboardContentProps) => {
    const shades = [
        'bg-blue-100 border-blue-300',
        'bg-blue-200 border-blue-400',
        'bg-blue-300 border-blue-500',
        'bg-blue-400 border-blue-600',
        'bg-blue-500 border-blue-700',
        'bg-blue-600 border-blue-800 text-white',
    ];

    return (
        <section className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
                text="Total Problems Solved"
                title="Overall"
                value={userData.totalSolved.toString()}
                shade={shades[0]}
                userData={userData}
            />

            {platformIds?.leetcodeId && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${shades[2]} hover:scale-105 transition-all duration-300`}
                >
                    <Leetcode username={platformIds.leetcodeId} userData={userData.leetcode} />
                </div>
            )}

            {userData?.gfg && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${shades[3]} hover:scale-105 transition-all duration-300`}
                >
                    <GFG userData={userData.gfg} />
                </div>
            )}

            {platformIds?.codeforcesId && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${shades[4]} hover:scale-105 transition-all duration-300`}
                >
                    <CodeForces userData={userData.codeforces} />
                </div>
            )}

            {platformIds?.githubId && (
                <div
                    className={`p-6 rounded-xl shadow-lg border ${shades[5]} hover:scale-105 transition-all duration-300`}
                >
                    <Github data={userData.github} />
                </div>
            )}
        </section>
    );
};

const StatsCard = ({ text, value, shade, title, userData }: StatsCardProps) => (
    <div
        className={`p-6 rounded-xl shadow-lg border ${shade} hover:scale-105 transition-all duration-300`}
    >
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {userData && (
            <>
                <h2 className="text-lg font-semibold mb-1">@{userData.username}</h2>
                <p className="text-sm text-gray-600 mb-4">{text}</p>
                <p className="text-4xl font-bold text-blue-600">{userData.totalSolved}</p>
            </>
        )}
    </div>
);