'use client';

import { useQuery } from "@tanstack/react-query";
import fetchLeetcodeStats from "../fetchers/fetch-leetcode";

const useLeetcodeData = (username?: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["leetcode", username],
        queryFn: () => fetchLeetcodeStats(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,
    });

    return {
        leetcodeData: data,
        isLoading,
        isError,
    };
};

export default useLeetcodeData;
