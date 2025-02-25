import { useEffect, useState } from "react";

export default function GFG({ username }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) 
            return;
        
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/gfg?username=${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch GFG user data");
                }
                const data = await response.json();
                setUserData(data.data);
                
            } 
            catch (err){
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
            {loading && <p>Loading your GFG data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {userData && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p>Institute Rank: {userData.institute_rank}</p>
                    <p>Problems Solved: {userData.total_problems_solved}</p>
                </div>
            )}
        </div>
    );
}
