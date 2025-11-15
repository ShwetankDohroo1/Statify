'use client';

import { useQuery } from '@tanstack/react-query';
import fetchGFGStats from '../fetchers/fetch-gfg';

const useGfgData = (gfgId?: string) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['gfg', gfgId],
        queryFn: () => fetchGFGStats(gfgId),
        enabled: !!gfgId,
        staleTime: 1000 * 60 * 5,
    });

    return {
        gfgData: data,
        isLoading,
        isError
    };
};

export default useGfgData;
