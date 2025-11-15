'use client';

import { useQuery } from '@tanstack/react-query';
import fetchLeetcodeStats from '../fetchers/fetch-leetcode';

const useLeetcodeData = (leetcodeId?: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['leetcode', leetcodeId],
        queryFn: () => fetchLeetcodeStats(leetcodeId),
        enabled: !!leetcodeId,
        staleTime: 1000 * 60 * 5,
    });

    return {
        leetcodeData: data,
        isLoading,
        isError
    };
};

export default useLeetcodeData;
