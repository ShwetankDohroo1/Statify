export type PlatformId = {
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
};

export type UserData = {
    username: string;
    totalSolved: number;
    github: {
        name: string;
        avatar: string;
        profileUrl: string;
        bio: string | null;
        followers: number;
    } | null;
    gfg: any | null;
    leetcode: any | null;
    codeforces: any | null;
};
