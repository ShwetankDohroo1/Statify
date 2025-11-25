import { gateway } from "../../lib/gateway";

const API = "/api/leetcode?username=";

const fetchLeetCodeStats = async (username?: string) => {
    if (!username) return null;
    return gateway.get(`${API}${username}`);
};

export default fetchLeetCodeStats;
