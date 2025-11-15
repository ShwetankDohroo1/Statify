import { gateway } from "../../lib/gateway";

const API = 'https://api.github.com/users/';

export type GithubResponse = any

const fetchGithubProfile = async (username?: string): Promise<GithubResponse> => {
  return gateway.get<GithubResponse>(`${username ? `${API}${username}` : ''}`);
};

export default fetchGithubProfile;
