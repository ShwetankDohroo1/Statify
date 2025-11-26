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
import UserCard from './user-card';
import PlotGraph from '../plot-graph';
import { motion } from 'framer-motion';

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

export default function DashBody() {
    const { username } = useParams<{ username?: string }>() ?? {};
    const [bgColor, setBgColor] = useState('#0a0b0d');

    const {
        userData: userDetails,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useUserDetails(username);

    const platformIds = useMemo(
        () => ({
            leetcodeId: userDetails?.leetcodeId || '',
            codeforcesId: userDetails?.codeforcesId || '',
            gfgId: userDetails?.gfgId || '',
            githubId: userDetails?.githubId || '',
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

    const solved = codeforcesData?.submissions?.filter((s: any) => s.verdict === 'OK') || [];
    const uniqueSolved = new Set(solved.map((s: any) => `${s.problem.contestId}-${s.problem.index}`));

    const ranks = [
        leetcodeData?.ranking ?? null,
        gfgData?.data?.institute_rank ?? null,
        codeforcesData?.rating ?? null,
    ].filter((r) => r !== null) as number[];

    const avgRank = ranks.length > 0 ? Math.round(ranks.reduce((acc, r) => acc + r, 0) / ranks.length) : undefined;

    const combinedData: UserData = {
        username: username ?? '',
        totalSolved:
            (leetcodeData?.solved?.total || 0) + (gfgData?.data?.total_problems_solved || 0) + (uniqueSolved?.size || 0),
        github: githubData
            ? {
                name: githubData.name || 'N/A',
                avatar: githubData.avatar_url || '',
                profileUrl: githubData.html_url || '#',
                bio: githubData.bio,
                followers: githubData.followers,
                publicRepos: githubData.public_repos,
            }
            : null,
        gfg: gfgData || null,
        leetcode: leetcodeData ?? null,
        codeforces: codeforcesData ?? null,
    };

    const connectedPlatformsCount = countPlatforms(platformIds);

    return (
        <div className="min-h-screen w-full transition-colors duration-500" style={{ backgroundColor: bgColor }}>
            <NavBar onBgChange={setBgColor} />

            <div className="border-b border-neutral-800/50 bg-gradient-to-b from-neutral-900/20 to-transparent">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <UserCard username={username ?? ''} userData={userDetails} />
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:scale-105 hover:bg-blue-500/20 duration-150">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 mb-2">Total Solved</p>
                                    <p className="text-4xl font-bold text-white mb-1">{combinedData.totalSolved}</p>
                                    <p className="text-xs text-neutral-500">Across all platforms</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:scale-105 hover:bg-emerald-500/20 duration-150">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 mb-2">Average Rank</p>
                                    <p className="text-4xl font-bold text-white mb-1">{avgRank ?? '—'}</p>
                                    <p className="text-xs text-neutral-500">Competitive rating</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:scale-105 hover:bg-amber-500/20 duration-150">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 mb-2">Platforms</p>
                                    <p className="text-4xl font-bold text-white mb-1">{connectedPlatformsCount}</p>
                                    <p className="text-xs text-neutral-500">Connected accounts</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                        >
                            <h2 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                                Platform Statistics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {platformIds?.leetcodeId && (
                                    <div className="group bg-[#16171a] border border-neutral-800/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1">
                                        <Leetcode userData={combinedData.leetcode} />
                                    </div>
                                )}

                                {combinedData?.gfg && (
                                    <div className="group bg-[#16171a] border border-neutral-800/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1">
                                        <GFG userData={combinedData.gfg} />
                                    </div>
                                )}

                                {platformIds?.codeforcesId && (
                                    <div className="group bg-[#16171a] border border-neutral-800/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1">
                                        <CodeForces userData={combinedData.codeforces} solved={uniqueSolved?.size} />
                                    </div>
                                )}

                                {connectedPlatformsCount < 3 && (
                                    <div className="bg-[#13141a]/50 border-2 border-dashed border-neutral-800/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-neutral-700/50 transition-colors duration-300">
                                        <div className="h-12 w-12 rounded-full bg-neutral-800/30 flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-neutral-400 mb-1">Add More Platforms</p>
                                        <p className="text-xs text-neutral-600">Connect additional coding profiles</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h2 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                                Activity Overview
                            </h2>
                            <div className="bg-[#16171a] border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
                                <PlotGraph dailyCounts={leetcodeData?.dailyCounts} dailySolved={leetcodeData?.dailySolvedProblems} />
                            </div>
                        </motion.div>
                    </div>

                    <aside className="xl:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                        >
                            <h2 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                                Connected Accounts
                            </h2>
                            <div className="bg-[#16171a] border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
                                <AccountsList platformIds={platformIds} userData={combinedData} />
                            </div>
                        </motion.div>

                        {platformIds?.githubId && combinedData.github && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <h2 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                                    <span className="h-1 w-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></span>
                                    GitHub Profile
                                </h2>
                                <div className="bg-[#16171a] border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
                                    <Github data={combinedData.github} />
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-5 shadow-xl"
                        >
                            <h3 className="text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                                </svg>
                                Pro Tip
                            </h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Keep your streak alive! Solve at least one problem daily to improve your ranking and consistency.
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

const LoadingUI = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d]">
        <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
            <p className="text-neutral-400 text-lg">Loading your dashboard...</p>
        </div>
    </div>
);

const ErrorUI = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d]">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl max-w-md">
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    </div>
);

const countPlatforms = (platformIds: PlatformId) => {
    return [platformIds.leetcodeId, platformIds.codeforcesId, platformIds.gfgId, platformIds.githubId].filter(Boolean).length;
};

const AccountsList = ({ platformIds, userData }: { platformIds: PlatformId; userData: UserData }) => {
    return (
        <ul className="space-y-2">
            {platformIds?.leetcodeId && <AccountItem name="LeetCode" id={platformIds.leetcodeId} color="amber" />}
            {platformIds?.gfgId && <AccountItem name="GFG" id={platformIds.gfgId} color="emerald" />}
            {platformIds?.codeforcesId && <AccountItem name="CodeForces" id={platformIds.codeforcesId} color="sky" />}
            {platformIds?.githubId && userData?.github && (
                <li>
                    <a
                        href={`https://github.com/${platformIds.githubId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/40 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3">
                            <img src={userData.github?.avatar || ''} alt="gh" className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-800 group-hover:ring-neutral-700" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-100 group-hover:text-white">GitHub</span>
                                <span className="text-xs text-neutral-500">{platformIds.githubId}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>{userData.github?.followers} followers</span>
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    </a>
                </li>
            )}
        </ul>
    );
};

const colorMap: Record<string, string> = {
    amber: 'bg-gradient-to-br from-amber-400 to-orange-500',
    emerald: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    sky: 'bg-gradient-to-br from-sky-400 to-blue-500',
    gray: 'bg-gradient-to-br from-gray-400 to-gray-600',
};

const AccountItem = ({ name, id, color }: { name: string; id: string; color: string }) => {
    const bg = colorMap[color] || colorMap.gray;

    const LINKS: Record<string, string> = {
        LeetCode: `https://leetcode.com/${id}`,
        CodeForces: `https://codeforces.com/profile/${id}`,
        GitHub: `https://github.com/${id}`,
        GFG: `https://auth.geeksforgeeks.org/user/${id}`,
    };

    const handleClick = () => window.open(LINKS[name], '_blank');

    return (
        <li onClick={handleClick} className="cursor-pointer">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/40 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${bg} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                        {name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-neutral-100 group-hover:text-white">{name}</div>
                        <div className="text-xs text-neutral-500">{id}</div>
                    </div>
                </div>
                <svg className="w-4 h-4 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </div>
        </li>
    );
};