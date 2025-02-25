import { useEffect, useState } from "react";

export default function Github({ username }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await fetch(`https://api.github.com/users/${username}`);
                if(!response.ok){
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUserData(data);
            } 
            catch(err){
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
            {loading && <p>Loading your Github data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {userData && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p>About: {userData.bio}</p>
                    <p>Followers: {userData.followers}</p>
                </div>
            )}
        </div>
    );
}
