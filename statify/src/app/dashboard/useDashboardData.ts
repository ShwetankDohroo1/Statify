import { useEffect, useState, useMemo } from "react";
import useLeetcodeData from "../hook/useLeetcodeData";
import useGfgData from "../hook/useGfgData";
import useGithubData from "../hook/useGithubData";
import useCodeforcesData from "../hook/useCodeforcesData";
import { GFGResponse } from "../fetchers/fetch-gfg";
import { CodeForcesReponse } from "../fetchers/fetch-codeforces";

type PlatformId = {
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
};

type CachedData = {
    leetcodeData: any | null;
    gfgData: GFGResponse | null;
    githubData: any | null;
    codeforcesData: CodeForcesReponse | null;
};

export const useDashboardData = (platformIds: PlatformId) => {
    const [cachedData, setCachedData] = useState<CachedData | null>(null);

    const fetchFlags = useMemo(() => ({
        leetcode: Boolean(platformIds.leetcodeId),
        gfg: Boolean(platformIds.gfgId),
        github: Boolean(platformIds.githubId),
        codeforces: Boolean(platformIds.codeforcesId),
    }), [
        platformIds.leetcodeId,
        platformIds.gfgId,
        platformIds.githubId,
        platformIds.codeforcesId,
    ]);


    useEffect(() => {
        const cached = sessionStorage.getItem("platformData");
        if (cached) {
            setCachedData(JSON.parse(cached));
            sessionStorage.removeItem("platformData");
        }
    }, []);


    const { leetcodeData, isLoading: lcLoad, isError: lcErr } =
        useLeetcodeData(fetchFlags.leetcode ? platformIds.leetcodeId : undefined);

    const { gfgData, isLoading: gfgLoad, isError: gfgErr } =
        useGfgData(fetchFlags.gfg ? platformIds.gfgId : undefined);

    const { githubData, isLoading: ghLoad, isError: ghErr } =
        useGithubData(fetchFlags.github ? platformIds.githubId : undefined);

    const { codeforcesData, isLoading: cfLoad, isError: cfErr } =
        useCodeforcesData(fetchFlags.codeforces ? platformIds.codeforcesId : undefined);


    const isLoading =
        (fetchFlags.leetcode && lcLoad) ||
        (fetchFlags.gfg && gfgLoad) ||
        (fetchFlags.github && ghLoad) ||
        (fetchFlags.codeforces && cfLoad);

    const finalData = {
        leetcodeData: cachedData?.leetcodeData ?? leetcodeData ?? null,
        gfgData: cachedData?.gfgData ?? gfgData ?? null,
        githubData: cachedData?.githubData ?? githubData ?? null,
        codeforcesData: cachedData?.codeforcesData ?? codeforcesData ?? null,
    };

    const isError = lcErr || gfgErr || ghErr || cfErr;

    return {
        ...finalData,
        isLoading,
        isError,
    };
};
