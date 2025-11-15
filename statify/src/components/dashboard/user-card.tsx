'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import UserProfileView from './user-profile-view';
import UserProfileForm from './user-profile-form';
import { User } from '@/app/fetchers/get-user';

type Props = {
    username: string;
    userData?: User;
};

const UserCard = ({ username, userData }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentData, setCurrentData] = useState<any>(userData);

    const handleSaved = (newData?: any) => {
        if (newData) setCurrentData((p: any) => ({ ...p, ...newData }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="p-6 rounded-xl shadow-lg border border-blue-400 bg-gradient-to-br from-blue-300 to-blue-500 text-white hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-md">
                            {username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{username}</h2>
                            <p className="text-sm opacity-80">@{username}</p>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Profile' : 'Profile Details'}</DialogTitle>
                </DialogHeader>

                {!isEditing ? (
                    <>
                        <UserProfileView userData={currentData} />
                        <div className="mt-6">
                            <Button className="w-full" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <UserProfileForm userData={currentData} onSaved={handleSaved} onCancel={handleCancel} />
                        <DialogFooter className="mt-4" />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserCard;
