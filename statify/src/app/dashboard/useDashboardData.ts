import { useEffect, useState } from "react";
import useLeetcodeData from "../hook/useLeetcodeData";
import useGfgData from "../hook/useGfgData";
import useGithubData from "../hook/useGithubData";
import useCodeforcesData from "../hook/useCodeforcesData";
import { GFGResponse } from "../fetchers/fetch-gfg";
import { LeetcodeResponse } from "../fetchers/fetch-leetcode";
import { CodeForcesReponse } from "../fetchers/fetch-codeforces";

type PlatformId = {
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
};

type CachedData = {
    leetcodeData: LeetcodeResponse | null;
    gfgData: GFGResponse | null;
    githubData: any | null;
    codeforcesData: CodeForcesReponse | null;
};

export const useDashboardData = (platformIds: PlatformId) => {
    const [cachedData, setCachedData] = useState<CachedData | null>(null);
    const [shouldFetch, setShouldFetch] = useState({
        leetcode: false,
        gfg: false,
        github: false,
        codeforces: false,
    });

    useEffect(() => {
        const cached = sessionStorage.getItem("platformData");
        if (cached) {
            const parsed = JSON.parse(cached);
            setCachedData(parsed);
            sessionStorage.removeItem("platformData");
        } else {
            setShouldFetch({
                leetcode: !!platformIds.leetcodeId,
                gfg: !!platformIds.gfgId,
                github: !!platformIds.githubId,
                codeforces: !!platformIds.codeforcesId,
            });
        }
    }, []);

    const {
        leetcodeData,
        isLoading: leetLoading,
        isError: leetError,
    } = useLeetcodeData(
        shouldFetch.leetcode ? platformIds.leetcodeId : undefined
    );

    const { gfgData, isLoading: gfgLoading, isError: gfgError } =
        useGfgData(shouldFetch.gfg ? platformIds.gfgId : undefined);

    const {
        githubData,
        isLoading: ghLoading,
        isError: ghError,
    } = useGithubData(shouldFetch.github ? platformIds.githubId : undefined);

    const {
        codeforcesData,
        isLoading: cdLoading,
        isError: cdError,
    } = useCodeforcesData(
        shouldFetch.codeforces ? platformIds.codeforcesId : undefined
    );

    const isLoading = shouldFetch.leetcode && leetLoading ||
        shouldFetch.gfg && gfgLoading ||
        shouldFetch.github && ghLoading ||
        shouldFetch.codeforces && cdLoading;

    const finalData = {
        leetcodeData: cachedData?.leetcodeData ?? leetcodeData ?? null,
        gfgData: cachedData?.gfgData ?? gfgData ?? null,
        githubData: cachedData?.githubData ?? githubData ?? null,
        codeforcesData: cachedData?.codeforcesData ?? codeforcesData ?? null,
    };

    return {
        ...finalData,
        isLoading,
        isError: leetError || gfgError || ghError || cdError,
    };
};