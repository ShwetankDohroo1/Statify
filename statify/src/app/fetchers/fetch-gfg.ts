import { gateway } from "../../lib/gateway";

const API = '/api/gfg?username='

export type GFGResponse = {
    data: {
        total_problems_solved: number;
        easy: number;
        medium: number;
        hard: number;
    };
}

const fetchGFGStats = async (gfgId?: string): Promise<GFGResponse | null> => {
    return await gateway.get<GFGResponse>(`${gfgId ? `${API}${gfgId}` : ''}`);
};

export default fetchGFGStats;
