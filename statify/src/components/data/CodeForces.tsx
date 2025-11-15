import { CodeForcesReponse } from "../../app/fetchers/fetch-codeforces";

type Props = {
    userData: CodeForcesReponse | null
}
export default function CodeForces({ userData }: Props) {
    return (
        <div className="w-full p-4">
            {userData && userData.data && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h1 className="text-5x">CodeForces</h1>
                    <h2 className="text-xl font-bold">{userData.data.handle}</h2>
                    <p>Contribution: {userData.data.contribution}</p>
                    <p>Friend Count: {userData.data.friendOfCount}</p>
                </div>
            )}
        </div>
    );
}
