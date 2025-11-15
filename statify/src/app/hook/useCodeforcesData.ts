'use client';

import { useQuery } from '@tanstack/react-query';
import fetchCodeForcesData from '../fetchers/fetch-codeforces';

const useCodeforcesData = (codeforcesId?: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['codeforcesId', codeforcesId],
        queryFn: () => fetchCodeForcesData(codeforcesId),
        enabled: !!codeforcesId,
        staleTime: 1000 * 60 * 5,
    });

    return {
        codeforcesData: data,
        isLoading,
        isError
    };
};

export default useCodeforcesData;
