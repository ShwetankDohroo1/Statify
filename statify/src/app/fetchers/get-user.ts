import { gateway } from "../../lib/gateway";

const API = '/api/users/me?username=';

export type User = {
    username: string;
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
}

const fetchUserData = async (username?: string): Promise<User> => {
    return gateway.get<User>(`${username ? `${API}${username}` : ''}`);
};
export default fetchUserData;
