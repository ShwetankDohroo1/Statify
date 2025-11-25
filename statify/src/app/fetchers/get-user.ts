import { gateway } from "../../lib/gateway";

const API = '/api/auth/me?username=';

export type User = {
    username: string;
    leetcodeId: string;
    codeforcesId: string;
    gfgId: string;
    githubId: string;
    email:string;
}

const fetchUserData = async (username?: string): Promise<User> => {
    return gateway.get<User>(`${username ? `${API}${username}` : ''}`);
};
export default fetchUserData;
