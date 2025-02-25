import { useEffect, useState } from "react";

export default function CodeForces({ username }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(username);
                const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUserData(data);
                // console.log(data);
            } 
            catch (err) {
                setError(err.message);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    return (
        <div className="w-full p-4">
            {loading && <p>Loading your CodeForces data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {userData && userData.result && userData.result.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">{userData.result[0].handle}</h2>
                    <p>Contribution: {userData.result[0].contribution}</p>
                    <p>Friend Count: {userData.result[0].friendOfCount}</p>
                </div>
            )}
        </div>
    );
}
