import { gateway } from "../../lib/gateway";

export type CodeForcesReponse = any;

const fetchCodeForcesData = async (codeforcesId?: string): Promise<CodeForcesReponse | null> => {
    if (!codeforcesId) return null;
    return await gateway.get<CodeForcesReponse>(`/api/codeforces?handle=${codeforcesId}`);
};

export default fetchCodeForcesData;