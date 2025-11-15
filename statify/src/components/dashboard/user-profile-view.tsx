'use client';

import { User } from '@/app/fetchers/get-user';
import React from 'react';

type Props = {
    userData: User;
};

const UserProfileView = ({ userData }: Props) => {
    return (
        <div className="space-y-4 text-sm text-slate-800">
            <div>
                <p className="font-semibold">Username</p>
                <p>{userData.username}</p>
            </div>

            <div>
                <p className="font-semibold">Email</p>
                <p>{userData.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="font-semibold">LeetCode</p>
                    <p>{userData.leetcodeId || 'Not set'}</p>
                </div>

                <div>
                    <p className="font-semibold">GFG</p>
                    <p>{userData.gfgId || 'Not set'}</p>
                </div>

                <div>
                    <p className="font-semibold">Codeforces</p>
                    <p>{userData.codeforcesId || 'Not set'}</p>
                </div>

                <div>
                    <p className="font-semibold">GitHub</p>
                    <p>{userData.githubId || 'Not set'}</p>
                </div>
            </div>
        </div>
    );
}

export default UserProfileView;