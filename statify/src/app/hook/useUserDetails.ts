'use client';

import { useQuery } from '@tanstack/react-query';
import fetchUserData from '../fetchers/get-user';

const useUserDetails = (username?: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user', username],
        queryFn: () => fetchUserData(username),
    });

    return {
        userData: data,
        isLoading,
        isError
    };
};

export default useUserDetails;
