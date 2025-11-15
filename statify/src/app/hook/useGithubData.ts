'use client';

import { useQuery } from '@tanstack/react-query';
import fetchGithubProfile from '../fetchers/fetch-github';

const useGithubData = (githubId?: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['githubId', githubId],
        queryFn: () => fetchGithubProfile(githubId),
        enabled: !!githubId,
        staleTime: 1000 * 60 * 5,
    });

    return {
        githubData: data,
        isLoading,
        isError
    };
};

export default useGithubData;
